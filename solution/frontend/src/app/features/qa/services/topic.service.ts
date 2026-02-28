import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic, Answer, CreateTopicRequest, Category, Tag } from '../../../core/models/topic.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TopicService {
  private readonly apiUrl = `${environment.apiUrl}/topics`;

  constructor(private http: HttpClient) {}

  getTopics(query?: string, categoryId?: number, status?: string, page = 1, pageSize = 20): Observable<Topic[]> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (query) params = params.set('query', query);
    if (categoryId) params = params.set('categoryId', categoryId);
    if (status) params = params.set('status', status);
    return this.http.get<Topic[]>(this.apiUrl, { params });
  }

  getTopic(id: number): Observable<Topic> {
    return this.http.get<Topic>(`${this.apiUrl}/${id}`);
  }

  createTopic(request: CreateTopicRequest): Observable<Topic> {
    return this.http.post<Topic>(this.apiUrl, request);
  }

  markAsSolved(topicId: number, answerId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${topicId}/solve?answerId=${answerId}`, {});
  }

  getAnswers(topicId: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiUrl}/${topicId}/answers`);
  }

  createAnswer(topicId: number, content: string): Observable<Answer> {
    return this.http.post<Answer>(`${this.apiUrl}/${topicId}/answers`, { content });
  }

  voteAnswer(topicId: number, answerId: number): Observable<{ voted: boolean }> {
    return this.http.post<{ voted: boolean }>(`${this.apiUrl}/${topicId}/answers/${answerId}/vote`, {});
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`);
  }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${environment.apiUrl}/tags`);
  }
}
