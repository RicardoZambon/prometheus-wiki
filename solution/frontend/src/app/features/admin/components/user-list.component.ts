import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { AdminUser } from '../../../core/models/admin.model';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

interface RoleDef {
  id: number;
  name: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [TimeAgoPipe],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage users and their roles</p>
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
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Roles</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Login</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                @for (user of users(); track user.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center shrink-0">
                          <i class="fa-solid fa-user text-primary-600 dark:text-primary-300 text-xs"></i>
                        </div>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ user.username }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</td>
                    <td class="px-4 py-3">
                      <div class="flex gap-1.5 flex-wrap">
                        @for (role of allRoles; track role.id) {
                          <button (click)="toggleRole(user, role)"
                                  [class]="hasRole(user, role.name)
                                    ? 'px-2.5 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 border border-primary-300 dark:border-primary-700 cursor-pointer transition-colors'
                                    : 'px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors'">
                            {{ role.name }}
                          </button>
                        }
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <span [class]="user.isActive
                        ? 'px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                        : 'px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'">
                        {{ user.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                      {{ user.lastLoginAt ? (user.lastLoginAt | timeAgo) : 'Never' }}
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" class="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                      No users found.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        @if (users().length > 0) {
          <div class="flex justify-center items-center gap-2 pt-2">
            <button (click)="prevPage()" [disabled]="currentPage <= 1"
                    class="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <i class="fa-solid fa-chevron-left mr-1"></i> Previous
            </button>
            <span class="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400">Page {{ currentPage }}</span>
            <button (click)="nextPage()" [disabled]="users().length < pageSize"
                    class="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Next <i class="fa-solid fa-chevron-right ml-1"></i>
            </button>
          </div>
        }
      }
    </div>
  `
})
export class UserListComponent implements OnInit {
  private adminService = inject(AdminService);

  users = signal<AdminUser[]>([]);
  loading = signal(true);
  currentPage = 1;
  pageSize = 20;

  allRoles: RoleDef[] = [
    { id: 1, name: 'User' },
    { id: 2, name: 'WikiEditor' },
    { id: 3, name: 'Admin' }
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  hasRole(user: AdminUser, roleName: string): boolean {
    return user.roles?.includes(roleName) ?? false;
  }

  toggleRole(user: AdminUser, role: RoleDef): void {
    if (this.hasRole(user, role.name)) {
      this.adminService.removeRole(user.id, role.id).subscribe({
        next: () => {
          this.users.update(users =>
            users.map(u => u.id === user.id
              ? { ...u, roles: u.roles.filter(r => r !== role.name) }
              : u
            )
          );
        }
      });
    } else {
      this.adminService.assignRole(user.id, role.id).subscribe({
        next: () => {
          this.users.update(users =>
            users.map(u => u.id === user.id
              ? { ...u, roles: [...u.roles, role.name] }
              : u
            )
          );
        }
      });
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.adminService.getUsers(this.currentPage, this.pageSize).subscribe({
      next: users => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
