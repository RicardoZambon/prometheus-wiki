import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getUsers(page = 1, pageSize = 20): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`, { params: { page, pageSize } });
  }

  assignRole(userId: number, roleId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/users/${userId}/roles/${roleId}`, {});
  }

  removeRole(userId: number, roleId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}/roles/${roleId}`);
  }

  getSettings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/settings`);
  }

  updateSetting(key: string, value: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/settings/${key}`, JSON.stringify(value), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
