import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminUser, CreateUserRequest } from '../../../core/models/admin.model';
import { Category } from '../../../core/models/topic.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly apiUrl = `${environment.apiUrl}/admin`;
  private readonly categoriesUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  // Users
  getUsers(page = 1, pageSize = 20): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/users`, { params: { page, pageSize } });
  }

  createUser(request: CreateUserRequest): Observable<AdminUser> {
    return this.http.post<AdminUser>(`${this.apiUrl}/users`, request);
  }

  assignRole(userId: number, roleId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/users/${userId}/roles/${roleId}`, {});
  }

  removeRole(userId: number, roleId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}/roles/${roleId}`);
  }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl);
  }

  createCategory(name: string, description: string): Observable<Category> {
    return this.http.post<Category>(this.categoriesUrl, { name, description });
  }

  updateCategory(category: Category): Observable<void> {
    return this.http.put<void>(`${this.categoriesUrl}/${category.id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categoriesUrl}/${id}`);
  }

  // Settings
  getSettings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/settings`);
  }

  updateSetting(key: string, value: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/settings/${key}`, JSON.stringify(value), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
