import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Product } from '../../shared/models/product.model';
import { ProductReviewsResponse, ProductService } from '../../services/product.service';
import { CompareService } from '../../services/compare.service';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

interface ReviewItem {
    _id: string;
    user: { _id?: string; name?: string } | null;
    rating: number;
    comment: string;
    createdAt?: string;
}

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [CurrencyPipe, DatePipe, ReactiveFormsModule, ProductCard],
    templateUrl: './product-details.html',
    styleUrl: './product-details.css'
})
export class ProductDetails {
    private readonly route = inject(ActivatedRoute);
    private readonly productService = inject(ProductService);
    private readonly compareService = inject(CompareService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly cartService = inject(CartService);
    readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    readonly product = signal<Product | null>(null);
    readonly relatedProducts = signal<Product[]>([]);
    readonly reviews = signal<ReviewItem[]>([]);
    readonly productLoading = signal(false);
    readonly reviewsLoading = signal(false);
    readonly productError = signal('');
    readonly reviewsError = signal('');
    readonly reviewSuccess = signal('');
    readonly reviewEligibilityLoading = signal(false);
    readonly canReview = signal(false);
    readonly alreadyReviewed = signal(false);
    readonly compareMessage = signal('');
    readonly cartMessage = signal('');
    readonly quantity = signal(1);

    readonly reviewForm = this.formBuilder.group({
        rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
        comment: ['', [Validators.required, Validators.minLength(3)]]
    });

    readonly averageRating = computed(() => {
        const reviews = this.reviews();

        if (!reviews.length) {
            return 0;
        }

        const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
        return total / reviews.length;
    });

    readonly reviewCount = computed(() => this.reviews().length);
    readonly compareCount = this.compareService.compareCount;
    readonly starRating = (value: number) => {
        const rounded = Math.max(0, Math.min(5, Math.round(value)));
        return `${'★'.repeat(rounded)}${'☆'.repeat(5 - rounded)}`;
    };

    readonly imageUrl = computed(() => {
        const result = this.product();

        if (!result?.image) {
            return '';
        }

        if (result.image.startsWith('/uploads/')) {
            return `https://bytezone.onrender.com${result.image}`;
        }

        if (/^https?:\/\//i.test(result.image)) {
            return result.image;
        }

        return `/images/products/${result.image}`;
    });

    readonly productInCompare = computed(() => {
        const currentProduct = this.product();

        return Boolean(currentProduct && this.compareService.isSelected(currentProduct._id));
    });

    constructor() {
        this.route.paramMap.subscribe((params) => {
            const productId = params.get('id');

            if (!productId) {
                this.productError.set('Product not found.');
                return;
            }

            this.loadProduct(productId);
        });
    }

    adjustQuantity(change: number): void {
        const currentProduct = this.product();
        if (!currentProduct || currentProduct.stock <= 0) {
            this.quantity.set(0);
            return;
        }

        const nextQuantity = this.quantity() + change;
        this.quantity.set(Math.min(currentProduct.stock, Math.max(1, nextQuantity)));
    }

    onAddToCart(): void {
        const currentProduct = this.product();

        if (!currentProduct || currentProduct.stock === 0) {
            return;
        }

        this.quantity.set(Math.min(this.quantity(), currentProduct.stock));

        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return;
        }

        this.cartService.addProduct(currentProduct, this.quantity()).subscribe({
            next: () => this.cartMessage.set('Product added to cart.'),
            error: (error) => this.cartMessage.set(error?.error?.message || 'Unable to add product to cart.')
        });
    }

    onBuyNow(): void {
        const currentProduct = this.product();

        if (!currentProduct || currentProduct.stock === 0) {
            return;
        }

        this.quantity.set(Math.min(this.quantity(), currentProduct.stock));

        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return;
        }

        this.cartService.addProduct(currentProduct, this.quantity()).subscribe({
            next: () => this.router.navigate(['/cart']),
            error: (error) => this.cartMessage.set(error?.error?.message || 'Unable to add product to cart.')
        });
    }

    onAddToCompare(): void {
        const currentProduct = this.product();

        if (!currentProduct) {
            return;
        }

        if (this.compareService.isProductInCompare(currentProduct._id)) {
            this.compareService.removeProduct(currentProduct._id);
            this.compareMessage.set('Product removed from compare.');
            this.reviewSuccess.set('');
            return;
        }

        const result = this.compareService.addProduct(currentProduct._id);
        this.compareMessage.set(result.message);

        if (result.success) {
            this.reviewSuccess.set('');
        }
    }

    private loadReviewEligibility(productId: string): void {
        if (!this.authService.isLoggedIn()) {
            this.canReview.set(false);
            this.alreadyReviewed.set(false);
            return;
        }
        this.reviewEligibilityLoading.set(true);
        this.productService.getReviewEligibility(productId).subscribe({
            next: (result) => {
                this.canReview.set(result.eligible && !result.alreadyReviewed);
                this.alreadyReviewed.set(result.alreadyReviewed);
                this.reviewEligibilityLoading.set(false);
            },
            error: () => {
                this.canReview.set(false);
                this.alreadyReviewed.set(false);
                this.reviewEligibilityLoading.set(false);
            }
        });
    }

    onSubmitReview(): void {
        const currentProduct = this.product();

        if (!currentProduct || !this.canReview()) {
            return;
        }

        if (this.reviewForm.invalid) {
            this.reviewForm.markAllAsTouched();
            this.reviewsError.set('Please provide a valid rating and comment.');
            return;
        }

        const payload = this.reviewForm.getRawValue();
        const rating = Number(payload.rating);
        const comment = payload.comment?.trim();

        if (!comment) {
            this.reviewsError.set('Review comment cannot be empty.');
            return;
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            this.reviewsError.set('Rating must be between 1 and 5.');
            return;
        }

        this.reviewsLoading.set(true);
        this.reviewsError.set('');
        this.reviewSuccess.set('');

        this.productService.createProductReview(currentProduct._id, { rating, comment }).subscribe({
            next: () => {
                this.reviewSuccess.set('Thank you for your review. Your review was submitted and is waiting for admin approval.');
                this.reviewForm.reset({ rating: 5, comment: '' });
                this.alreadyReviewed.set(true);
                this.canReview.set(false);
                this.loadReviews(currentProduct._id);
                this.reviewsLoading.set(false);
            },
            error: (error) => {
                const message = error?.error?.message || 'Unable to submit review.';
                this.reviewsError.set(message);
                this.reviewsLoading.set(false);
            }
        });
    }

    removeReview(reviewId: string): void {
        const currentProduct = this.product();

        if (!currentProduct) {
            return;
        }

        this.reviewsLoading.set(true);
        this.productService.deleteProductReview(currentProduct._id, reviewId).subscribe({
            next: () => {
                this.loadReviews(currentProduct._id);
            },
            error: (error) => {
                const message = error?.error?.message || 'Unable to delete review.';
                this.reviewsError.set(message);
                this.reviewsLoading.set(false);
            }
        });
    }

    private loadProduct(productId: string): void {
        this.productLoading.set(true);
        this.productError.set('');
        this.compareMessage.set('');

        this.productService.getProductById(productId).subscribe({
            next: (response) => {
                const currentProduct = response.product;
                this.product.set(currentProduct);
                this.quantity.set(currentProduct.stock > 0 ? 1 : 0);
                this.productLoading.set(false);
                this.loadReviews(currentProduct._id);
                this.loadReviewEligibility(currentProduct._id);
                this.loadRelatedProducts(currentProduct.category, currentProduct._id);
            },
            error: (error) => {
                this.productError.set(error?.error?.message || 'Unable to load product.');
                this.productLoading.set(false);
            }
        });
    }

    private loadReviews(productId: string): void {
        this.reviewsLoading.set(true);
        this.reviewsError.set('');

        this.productService.getProductReviews(productId).subscribe({
            next: (response: ProductReviewsResponse) => {
                const normalizedReviews: ReviewItem[] = (response.reviews || []).map((review) => ({
                    _id: review._id,
                    user: review.user ?? null,
                    rating: review.rating,
                    comment: review.comment,
                    createdAt: review.createdAt
                }));

                this.reviews.set(normalizedReviews);
                this.reviewsLoading.set(false);
            },
            error: (error) => {
                this.reviewsError.set(error?.error?.message || 'Unable to load reviews.');
                this.reviewsLoading.set(false);
            }
        });
    }

    private loadRelatedProducts(category: string, currentProductId: string): void {
        if (!category) {
            this.relatedProducts.set([]);
            return;
        }

        this.productService.getProducts({ category, limit: 4 }).subscribe({
            next: (response) => {
                const filteredProducts = (response.products || []).filter((item) => item._id !== currentProductId).slice(0, 4);
                this.relatedProducts.set(filteredProducts);
            },
            error: () => {
                this.relatedProducts.set([]);
            }
        });
    }

    protected readonly Object = Object;
}
