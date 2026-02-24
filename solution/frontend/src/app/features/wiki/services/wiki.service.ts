import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WikiPage, WikiPageTreeNode, CreateWikiPageRequest } from '../../../core/models/wiki.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WikiService {
  private readonly apiUrl = `${environment.apiUrl}/wikipages`;

  constructor(private http: HttpClient) {}

  getTree(): Observable<WikiPageTreeNode[]> {
    return this.http.get<WikiPageTreeNode[]>(`${this.apiUrl}/tree`);
  }

  getPage(id: number, language?: string): Observable<WikiPage> {
    const params = language ? { language } : {};
    return this.http.get<WikiPage>(`${this.apiUrl}/${id}`, { params });
  }

  search(query: string): Observable<WikiPage[]> {
    return this.http.get<WikiPage[]>(`${this.apiUrl}/search`, { params: { query } });
  }

  createPage(request: CreateWikiPageRequest): Observable<WikiPage> {
    return this.http.post<WikiPage>(this.apiUrl, request);
  }

  updatePage(id: number, content: string): Observable<WikiPage> {
    return this.http.put<WikiPage>(`${this.apiUrl}/${id}`, { content });
  }

  getVersions(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/versions`);
  }

  translatePage(id: number, language: string, content: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/translate`, { language, content });
  }
}
