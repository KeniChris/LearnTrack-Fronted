import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity, Question } from '../../shared/models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private http = inject(HttpClient);

  getByTopic(topicId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${environment.apiUrl}/topics/${topicId}/activities`);
  }

  create(topicId: number, dto: { title: string; description?: string; questions: Question[] }): Observable<Activity> {
    return this.http.post<Activity>(`${environment.apiUrl}/topics/${topicId}/activities`, dto);
  }

  delete(activityId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/activities/${activityId}`);
  }

  uploadAI(file: File, topicName: string, types: string[]): Observable<any> {
    const form = new FormData();
    form.append('file', file);
    form.append('topicName', topicName);
    types.forEach(t => form.append('types', t));
    return this.http.post(`${environment.apiUrl}/ai/upload-activity`, form);
  }
}
