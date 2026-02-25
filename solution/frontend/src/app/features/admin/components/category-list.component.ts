import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { Category } from '../../../core/models/topic.model';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [FormsModule, TimeAgoPipe],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Category Management</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage topic categories</p>
      </div>

      @if (errorMessage()) {
        <div class="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
          <i class="fa-solid fa-circle-exclamation"></i> {{ errorMessage() }}
        </div>
      }

      <!-- Add new category -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Add New Category</h3>
        <div class="flex gap-3 flex-wrap">
          <input type="text" [(ngModel)]="newName" placeholder="Category name"
                 class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm transition-colors" />
          <input type="text" [(ngModel)]="newDescription" placeholder="Description (optional)"
                 class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm transition-colors" />
          <button (click)="addCategory()" [disabled]="!newName.trim() || saving()"
                  class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors shrink-0">
            @if (saving()) { <i class="fa-solid fa-spinner fa-spin"></i> }
            <i class="fa-solid fa-plus"></i> Add
          </button>
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <i class="fa-solid fa-spinner fa-spin text-2xl text-primary-500"></i>
        </div>
      } @else {
        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 dark:bg-gray-800/50">
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                  <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                @for (cat of categories(); track cat.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    @if (editingId() === cat.id) {
                      <td class="px-4 py-3">
                        <input type="text" [(ngModel)]="editName"
                               class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:border-primary-500 transition-colors" />
                      </td>
                      <td class="px-4 py-3">
                        <input type="text" [(ngModel)]="editDescription"
                               class="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:border-primary-500 transition-colors" />
                      </td>
                      <td class="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                        {{ cat.createdAt | timeAgo }}
                      </td>
                      <td class="px-4 py-3 text-right">
                        <div class="flex justify-end gap-1.5">
                          <button (click)="saveEdit(cat)"
                                  class="px-2.5 py-1 text-xs font-medium rounded bg-primary-600 text-white hover:bg-primary-700 transition-colors">
                            Save
                          </button>
                          <button (click)="cancelEdit()"
                                  class="px-2.5 py-1 text-xs font-medium rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            Cancel
                          </button>
                        </div>
                      </td>
                    } @else {
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-2">
                          <i class="fa-solid fa-folder text-primary-500 text-sm"></i>
                          <span class="text-sm font-medium text-gray-900 dark:text-white">{{ cat.name }}</span>
                        </div>
                      </td>
                      <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {{ cat.description || '-' }}
                      </td>
                      <td class="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                        {{ cat.createdAt | timeAgo }}
                      </td>
                      <td class="px-4 py-3 text-right">
                        <div class="flex justify-end gap-1.5">
                          <button (click)="startEdit(cat)"
                                  class="p-1.5 rounded text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                  title="Edit">
                            <i class="fa-solid fa-pen-to-square text-sm"></i>
                          </button>
                          <button (click)="deleteCategory(cat)"
                                  class="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                  title="Delete">
                            <i class="fa-solid fa-trash text-sm"></i>
                          </button>
                        </div>
                      </td>
                    }
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="4" class="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                      <i class="fa-solid fa-folder-open text-3xl mb-3 block"></i>
                      <p>No categories yet. Add one above.</p>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `
})
export class CategoryListComponent implements OnInit {
  private adminService = inject(AdminService);

  categories = signal<(Category & { createdAt?: string })[]>([]);
  loading = signal(true);
  saving = signal(false);
  errorMessage = signal('');
  editingId = signal<number | null>(null);

  newName = '';
  newDescription = '';
  editName = '';
  editDescription = '';

  ngOnInit(): void {
    this.loadCategories();
  }

  addCategory(): void {
    if (!this.newName.trim()) return;

    this.saving.set(true);
    this.errorMessage.set('');

    this.adminService.createCategory(this.newName.trim(), this.newDescription.trim()).subscribe({
      next: (cat) => {
        this.categories.update(cats => [...cats, cat]);
        this.newName = '';
        this.newDescription = '';
        this.saving.set(false);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(err.error?.message ?? 'Failed to create category.');
      }
    });
  }

  startEdit(cat: Category): void {
    this.editingId.set(cat.id);
    this.editName = cat.name;
    this.editDescription = cat.description || '';
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  saveEdit(cat: Category): void {
    if (!this.editName.trim()) return;

    const updated = { ...cat, name: this.editName.trim(), description: this.editDescription.trim() };
    this.adminService.updateCategory(updated).subscribe({
      next: () => {
        this.categories.update(cats =>
          cats.map(c => c.id === cat.id ? { ...c, name: updated.name, description: updated.description } : c)
        );
        this.editingId.set(null);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'Failed to update category.');
      }
    });
  }

  deleteCategory(cat: Category): void {
    if (!confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return;

    this.errorMessage.set('');
    this.adminService.deleteCategory(cat.id).subscribe({
      next: () => {
        this.categories.update(cats => cats.filter(c => c.id !== cat.id));
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'Failed to delete category.');
      }
    });
  }

  private loadCategories(): void {
    this.adminService.getCategories().subscribe({
      next: cats => {
        this.categories.set(cats);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
