import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../shared/models/product.model';

interface HeroSlide {
  image: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
}

interface Category {
  name: string;
  description: string;
  image: string;
  query: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnDestroy {
  private readonly productService = inject(ProductService);

  readonly featuredProducts = signal<Product[]>([]);
  readonly featuredLoading = signal(true);
  readonly featuredError = signal('');

  readonly slides: HeroSlide[] = [
    {
      image: '/images/hero.png',
      badge: 'PREMIUM PC HARDWARE',
      title: 'Build Your',
      highlight: 'Dream PC',
      description: 'Discover powerful processors, graphics cards, memory, storage and everything you need for a setup built around you.',
    },
    {
      image: '/images/products/gpu.jpg',
      badge: 'PERFORMANCE WITHOUT COMPROMISE',
      title: 'Power Your',
      highlight: 'Next Build',
      description: 'Explore graphics cards and components selected for gaming, workstations and everyday performance.',
    },
    {
      image: '/images/products/cpu.jpg',
      badge: 'SMART HARDWARE SHOPPING',
      title: 'Upgrade With',
      highlight: 'Confidence',
      description: 'Compare trusted components, check availability and find the right parts for your budget.',
    },
  ];

  readonly categories: Category[] = [
    { name: 'Processors', description: 'Powerful CPUs for every build', image: '/images/cpu.jpg', query: 'CPU' },
    { name: 'Graphics Cards', description: 'Next-level gaming performance', image: '/images/gpu.jpg', query: 'GPU' },
    { name: 'Memory', description: 'Fast and reliable RAM', image: '/images/ram.jpg', query: 'RAM' },
    { name: 'Storage', description: 'Fast SSDs and high capacity', image: '/images/ssd.jpg', query: 'Storage' },
    { name: 'Monitors', description: 'Sharper, smoother displays', image: '/images/monitor.jpg', query: 'Monitor' },
  ];

  readonly activeSlide = signal(0);
  readonly categoryStart = signal(0);
  readonly typedText = signal('');
  readonly isTyping = signal(true);

  private slideTimer?: ReturnType<typeof setInterval>;
  private typingTimer?: ReturnType<typeof setTimeout>;
  private categoryTimer?: ReturnType<typeof setInterval>;
  private typingGeneration = 0;

  constructor() {
    this.loadFeaturedProducts();
    this.startHeroSlider();
    this.startTyping();
    this.startCategorySlider();
  }

  loadFeaturedProducts(): void {
    this.featuredLoading.set(true);
    this.featuredError.set('');

    this.productService.getProducts({ page: 1, limit: 4, sort: 'newest' }).subscribe({
      next: (response) => {
        this.featuredProducts.set(response.products);
        this.featuredLoading.set(false);
      },
      error: (error) => {
        console.error('Unable to load featured products:', error);
        this.featuredError.set('Unable to load featured products.');
        this.featuredLoading.set(false);
      },
    });
  }

  imageUrl(image?: string): string {
    if (!image) return '';
    if (image.startsWith('/uploads/')) {
      const apiBase = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://bytezone.onrender.com';
      return `${apiBase}${image}`;
    }
    if (image.startsWith('http')) return image;
    return `/images/products/${image}`;
  }

  nextSlide(): void {
    this.activeSlide.update((index) => (index + 1) % this.slides.length);
    this.startTyping();
  }

  previousSlide(): void {
    this.activeSlide.update((index) => (index - 1 + this.slides.length) % this.slides.length);
    this.startTyping();
  }

  goToSlide(index: number): void {
    this.activeSlide.set(index);
    this.startTyping();
  }

  nextCategory(): void {
    const maxStart = Math.max(0, this.categories.length - 4);
    this.categoryStart.update((index) => (index >= maxStart ? 0 : index + 1));
  }

  previousCategory(): void {
    const maxStart = Math.max(0, this.categories.length - 4);
    this.categoryStart.update((index) => (index <= 0 ? maxStart : index - 1));
  }

  visibleCategories(): Category[] {
    const start = this.categoryStart();
    return [...this.categories.slice(start, start + 4), ...this.categories.slice(0, Math.max(0, start + 4 - this.categories.length))];
  }

  private startHeroSlider(): void {
    this.slideTimer = setInterval(() => this.nextSlide(), 3000);
  }

  private startCategorySlider(): void {
    this.categoryTimer = setInterval(() => this.nextCategory(), 4000);
  }

  private startTyping(): void {
    this.typingGeneration++;
    const generation = this.typingGeneration;
    if (this.typingTimer) clearTimeout(this.typingTimer);

    const target = this.slides[this.activeSlide()].highlight;
    this.typedText.set('');
    this.isTyping.set(true);

    let position = 0;
    const typeNext = () => {
      if (generation !== this.typingGeneration) return;
      if (position < target.length) {
        position++;
        this.typedText.set(target.slice(0, position));
        this.typingTimer = setTimeout(typeNext, 85);
      } else {
        this.isTyping.set(false);
      }
    };
    this.typingTimer = setTimeout(typeNext, 180);
  }

  trackCategory(_: number, category: Category): string {
    return category.query;
  }

  ngOnDestroy(): void {
    if (this.slideTimer) clearInterval(this.slideTimer);
    if (this.categoryTimer) clearInterval(this.categoryTimer);
    if (this.typingTimer) clearTimeout(this.typingTimer);
  }
}
