import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic } from '../../shared/models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TopicService {
  private http = inject(HttpClient);

  getByCollection(collectionName: string): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${environment.apiUrl}/collections/${encodeURIComponent(collectionName)}/topics`);
  }

  create(collectionName: string, dto: { name: string; orderIdx?: number }): Observable<Topic> {
    const body = { ...dto, orderIdx: dto.orderIdx ?? 0 };
    return this.http.post<Topic>(`${environment.apiUrl}/collections/${encodeURIComponent(collectionName)}/topics`, body);
  }
}
