import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'prometheus_token';

  private currentUser = signal<AuthResponse | null>(this.loadStoredUser());

  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly username = computed(() => this.currentUser()?.username ?? '');
  readonly roles = computed(() => this.currentUser()?.roles ?? []);

  constructor(private http: HttpClient, private router: Router) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => this.setSession(response))
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => this.setSession(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasRole(role: string): boolean {
    return this.roles().includes(role);
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, JSON.stringify(response));
    this.currentUser.set(response);
  }

  private loadStoredUser(): AuthResponse | null {
    const stored = localStorage.getItem(this.tokenKey);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as AuthResponse;
    if (new Date(parsed.expiresAt) < new Date()) {
      localStorage.removeItem(this.tokenKey);
      return null;
    }
    return parsed;
  }
}
