// src/app/core/services/learning-hub.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StudentLearningPath } from '../../shared/models/learning-gap.model';

@Injectable({ providedIn: 'root' })
export class LearningHubService {
  private http = inject(HttpClient);

  getLearningPaths(groupCode: string): Observable<StudentLearningPath[]> {
    return this.http.get<StudentLearningPath[]>(`${environment.apiUrl}/learning-paths/group/${groupCode}`);
  }

  getSuggestedResource(topicId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/conceptual-gaps/topic/${topicId}/resource`);
  }
}