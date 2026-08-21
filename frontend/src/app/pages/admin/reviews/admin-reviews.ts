import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AdminReview, AdminService } from '../../../services/admin.service';
@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin-reviews.html',
  styleUrl: '../admin-shared.css',
})
export class AdminReviews {
  private readonly service = inject(AdminService);
  readonly reviews = signal<AdminReview[]>([]);
  readonly filter = signal<'all' | 'pending' | 'approved'>('pending');
  readonly loading = signal(true);
  readonly error = signal('');
  readonly saving = signal('');
  constructor() {
    this.load();
  }
  load() {
    this.loading.set(true);
    this.service.getReviews(this.filter()).subscribe({
      next: (r) => {
        this.reviews.set(r);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e?.error?.message || 'Unable to load reviews.');
        this.loading.set(false);
      },
    });
  }
  setFilter(f: 'all' | 'pending' | 'approved') {
    this.filter.set(f);
    this.load();
  }
  approve(r: AdminReview, a: boolean) {
    this.saving.set(r._id);
    this.service.updateReviewApproval(r._id, a).subscribe({
      next: (u) => {
        this.reviews.update((list) => list.map((x) => (x._id === u._id ? u : x)));
        this.saving.set('');
      },
      error: (e) => {
        this.error.set(e?.error?.message || 'Unable to update review.');
        this.saving.set('');
      },
    });
  }
  remove(r: AdminReview) {
    if (!confirm('Delete this review permanently?')) return;
    this.saving.set(r._id);
    this.service.deleteReview(r._id).subscribe({
      next: () => {
        this.reviews.update((list) => list.filter((x) => x._id !== r._id));
        this.saving.set('');
      },
      error: (e) => {
        this.error.set(e?.error?.message || 'Unable to delete review.');
        this.saving.set('');
      },
    });
  }
}
