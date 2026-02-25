import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { AdminUser } from '../../../core/models/admin.model';
import { AuthService } from '../../../core/services/auth.service';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

interface RoleDef {
  id: number;
  name: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [FormsModule, TimeAgoPipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage users and their roles</p>
        </div>
        <button (click)="showCreateModal.set(true)"
                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <i class="fa-solid fa-user-plus"></i> New User
        </button>
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
                        @for (role of visibleRoles; track role.id) {
                          <button (click)="toggleRole(user, role)"
                                  [disabled]="!canToggleRole(role)"
                                  [class]="hasRole(user, role.name)
                                    ? 'px-2.5 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 border border-primary-300 dark:border-primary-700 transition-colors' + (canToggleRole(role) ? ' cursor-pointer' : ' opacity-60 cursor-not-allowed')
                                    : 'px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 border border-gray-200 dark:border-gray-700 transition-colors' + (canToggleRole(role) ? ' cursor-pointer hover:border-primary-300 dark:hover:border-primary-700' : ' opacity-60 cursor-not-allowed')">
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

    <!-- Create User Modal -->
    @if (showCreateModal()) {
      <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="showCreateModal.set(false)">
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 w-full max-w-lg"
             (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Create New User</h2>
            <button (click)="showCreateModal.set(false)"
                    class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="p-6 space-y-4">
            @if (createError()) {
              <div class="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                <i class="fa-solid fa-circle-exclamation"></i> {{ createError() }}
              </div>
            }

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <input type="text" [(ngModel)]="newUsername" placeholder="Username"
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm transition-colors" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" [(ngModel)]="newEmail" placeholder="user@example.com"
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm transition-colors" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input type="password" [(ngModel)]="newPassword" placeholder="Minimum 8 characters"
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm transition-colors" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
              <select [(ngModel)]="newLanguage"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm transition-colors">
                <option value="en">English</option>
                <option value="pt">Portuguese</option>
                <option value="es">Spanish</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Roles</label>
              <div class="flex flex-wrap gap-2">
                @for (role of creatableRoles; track role.id) {
                  <button type="button" (click)="toggleNewUserRole(role.id)"
                          [class]="newRoleIds.includes(role.id)
                            ? 'px-3 py-1.5 text-xs font-medium rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 border border-primary-300 dark:border-primary-700 cursor-pointer transition-colors'
                            : 'px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer transition-colors'">
                    {{ role.name }}
                  </button>
                }
              </div>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">The "User" role is always assigned by default.</p>
            </div>
          </div>

          <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            <button (click)="showCreateModal.set(false)"
                    class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              Cancel
            </button>
            <button (click)="createUser()" [disabled]="creating() || !newUsername.trim() || !newEmail.trim() || !newPassword.trim()"
                    class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
              @if (creating()) { <i class="fa-solid fa-spinner fa-spin"></i> }
              Create User
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class UserListComponent implements OnInit {
  private adminService = inject(AdminService);
  private authService = inject(AuthService);

  users = signal<AdminUser[]>([]);
  loading = signal(true);
  showCreateModal = signal(false);
  creating = signal(false);
  createError = signal('');
  currentPage = 1;
  pageSize = 20;

  // Create user form fields
  newUsername = '';
  newEmail = '';
  newPassword = '';
  newLanguage = 'en';
  newRoleIds: number[] = [];

  allRoles: RoleDef[] = [
    { id: 1, name: 'User' },
    { id: 2, name: 'WikiEditor' },
    { id: 3, name: 'Admin' },
    { id: 4, name: 'UserManager' }
  ];

  // Roles visible in the user table (all roles for admin, no Admin for UserManager)
  get visibleRoles(): RoleDef[] {
    if (this.authService.hasRole('Admin')) return this.allRoles;
    return this.allRoles.filter(r => r.id !== 3); // hide Admin role for UserManagers
  }

  // Roles available in the create user modal (exclude User since it's auto-assigned)
  get creatableRoles(): RoleDef[] {
    const roles = this.allRoles.filter(r => r.id !== 1); // exclude base User role
    if (!this.authService.hasRole('Admin')) {
      return roles.filter(r => r.id !== 3); // hide Admin role for UserManagers
    }
    return roles;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  hasRole(user: AdminUser, roleName: string): boolean {
    return user.roles?.includes(roleName) ?? false;
  }

  canToggleRole(role: RoleDef): boolean {
    if (role.id === 3 && !this.authService.hasRole('Admin')) return false;
    return true;
  }

  toggleRole(user: AdminUser, role: RoleDef): void {
    if (!this.canToggleRole(role)) return;

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

  toggleNewUserRole(roleId: number): void {
    const index = this.newRoleIds.indexOf(roleId);
    if (index === -1) {
      this.newRoleIds.push(roleId);
    } else {
      this.newRoleIds.splice(index, 1);
    }
  }

  createUser(): void {
    if (!this.newUsername.trim() || !this.newEmail.trim() || !this.newPassword.trim()) return;

    this.creating.set(true);
    this.createError.set('');

    this.adminService.createUser({
      username: this.newUsername.trim(),
      email: this.newEmail.trim(),
      password: this.newPassword,
      languagePreference: this.newLanguage,
      roleIds: this.newRoleIds
    }).subscribe({
      next: (user) => {
        this.users.update(users => [...users, user]);
        this.resetCreateForm();
        this.showCreateModal.set(false);
        this.creating.set(false);
      },
      error: (err) => {
        this.creating.set(false);
        this.createError.set(err.error?.message ?? 'Failed to create user.');
      }
    });
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

  private resetCreateForm(): void {
    this.newUsername = '';
    this.newEmail = '';
    this.newPassword = '';
    this.newLanguage = 'en';
    this.newRoleIds = [];
    this.createError.set('');
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
