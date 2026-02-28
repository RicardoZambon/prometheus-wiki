import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="w-full max-w-md mx-auto">
      <div class="text-center mb-8">
        <i class="fa-solid fa-fire text-4xl text-primary-600 dark:text-primary-400"></i>
        <h2 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Sign in to Prometheus Wiki</p>
      </div>

      @if (errorMessage) {
        <div class="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
          <i class="fa-solid fa-circle-exclamation"></i> {{ errorMessage }}
        </div>
      }

      <form (ngSubmit)="onSubmit()" class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
          <input id="username" type="text" [(ngModel)]="username" name="username" required autocomplete="username"
                 class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input id="password" type="password" [(ngModel)]="password" name="password" required autocomplete="current-password"
                 class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors" />
        </div>
        <button type="submit" [disabled]="isLoading"
                class="w-full py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
          @if (isLoading) {
            <i class="fa-solid fa-spinner fa-spin"></i>
          }
          {{ isLoading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>

      <p class="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
        Don't have an account?
        <a routerLink="/register" class="text-primary-600 dark:text-primary-400 font-medium hover:underline">Register</a>
      </p>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/topics']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message ?? 'Invalid username or password.';
      }
    });
  }
}
