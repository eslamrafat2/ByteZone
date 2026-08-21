import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './admin-products.html',
  styleUrl: '../admin-shared.css',
})
export class AdminProducts {
  private readonly service = inject(AdminService);
  private readonly productService = inject(ProductService);
  private readonly fb = inject(FormBuilder);

  readonly products = signal<Product[]>([]);
  readonly editingId = signal('');
  readonly formVisible = signal(false);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly message = signal('');
  readonly saving = signal('');
  readonly uploading = signal(false);
  readonly imagePreview = signal('');

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    category: ['', Validators.required],
    brand: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    image: [''],
    description: [''],
    specifications: this.fb.array([]),
  });

  constructor() {
    this.load();
  }

  get specifications(): FormArray {
    return this.form.controls.specifications;
  }

  load() {
    this.loading.set(true);
    this.productService.getProducts({ limit: 100 }).subscribe({
      next: (r) => {
        this.products.set(r.products);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e?.error?.message || 'Unable to load products.');
        this.loading.set(false);
      },
    });
  }

  startCreate() {
    this.editingId.set('');
    this.formVisible.set(true);
    this.imagePreview.set('');
    this.form.reset({
      name: '',
      category: '',
      brand: '',
      price: 0,
      stock: 0,
      image: '',
      description: '',
    });
    this.clearSpecifications();
    this.addSpecification();
  }

  startEdit(p: Product) {
    this.editingId.set(p._id);
    this.formVisible.set(true);
    this.imagePreview.set(this.imageUrl(p.image));
    this.form.patchValue({
      name: p.name,
      category: p.category,
      brand: p.brand,
      price: p.price,
      stock: p.stock,
      image: p.image,
      description: p.description,
    });

    this.clearSpecifications();
    for (const [name, value] of Object.entries(p.specifications || {})) {
      this.addSpecification(name, String(value ?? ''));
    }
    if (!this.specifications.length) {
      this.addSpecification();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addSpecification(name = '', value = '') {
    this.specifications.push(
      this.fb.group({
        name: [name],
        value: [value],
      }),
    );
  }

  removeSpecification(index: number) {
    this.specifications.removeAt(index);
    if (!this.specifications.length) {
      this.addSpecification();
    }
  }

  clearSpecifications() {
    while (this.specifications.length) {
      this.specifications.removeAt(0);
    }
  }

  cancel() {
    this.formVisible.set(false);
    this.editingId.set('');
    this.imagePreview.set('');
  }

  imageUrl(image?: string) {
    if (!image) return '';
    if (image.startsWith('/uploads/')) return `https://bytezone.onrender.com${image}`;
    if (image.startsWith('http')) return image;
    return `/images/products/${image}`;
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      this.error.set('Image must be 5MB or smaller.');
      input.value = '';
      return;
    }
    this.uploading.set(true);
    this.service.uploadProductImage(file).subscribe({
      next: (url) => {
        this.form.patchValue({ image: url });
        this.imagePreview.set(this.imageUrl(url));
        this.uploading.set(false);
      },
      error: (e) => {
        this.error.set(e?.error?.message || 'Unable to upload image.');
        this.uploading.set(false);
      },
    });
  }

  save() {
    if (this.form.invalid || this.uploading()) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const specifications: Record<string, string> = {};

    for (const specification of v.specifications || []) {
      const spec = specification as { name?: unknown; value?: unknown };
      const name = String(spec.name || '').trim();
      const value = String(spec.value || '').trim();
      if (name && value) {
        specifications[name] = value;
      }
    }

    const payload: Partial<Product> = {
      name: v.name!.trim(),
      category: v.category!.trim(),
      brand: v.brand!.trim(),
      price: Number(v.price),
      stock: Number(v.stock),
      image: v.image?.trim() || '',
      description: v.description?.trim() || '',
      specifications,
    };

    const id = this.editingId();
    this.saving.set('product');
    const req = id ? this.service.updateProduct(id, payload) : this.service.createProduct(payload);
    req.subscribe({
      next: () => {
        this.saving.set('');
        this.message.set(id ? 'Product updated successfully.' : 'Product created successfully.');
        this.cancel();
        this.load();
      },
      error: (e) => {
        this.saving.set('');
        this.error.set(e?.error?.message || 'Unable to save product.');
      },
    });
  }

  remove(p: Product) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    this.saving.set(p._id);
    this.service.deleteProduct(p._id).subscribe({
      next: () => {
        this.products.update((list) => list.filter((x) => x._id !== p._id));
        this.saving.set('');
        this.message.set('Product deleted successfully.');
      },
      error: (e) => {
        this.saving.set('');
        this.error.set(e?.error?.message || 'Unable to delete product.');
      },
    });
  }
}
