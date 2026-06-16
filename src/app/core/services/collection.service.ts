import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Collection, TopicStat, GroupStat } from '../../shared/models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CollectionService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/collections`;

  getMyCollections(): Observable<Collection[]> {
    return this.http.get<Collection[]>(`${this.base}/mine`);
  }

  create(dto: { name: string; description?: string }): Observable<Collection> {
    return this.http.post<Collection>(this.base, dto);
  }

  getTopicStats(name: string, start?: string, end?: string): Observable<TopicStat[]> {
    const params: Record<string, string> = {};
    if (start) params['startDate'] = start;
    if (end) params['endDate'] = end;
    return this.http.get<TopicStat[]>(`${this.base}/${encodeURIComponent(name)}/statistics`, { params });
  }

  getGroupStats(name: string, start?: string, end?: string): Observable<GroupStat[]> {
    const params: Record<string, string> = {};
    if (start) params['startDate'] = start;
    if (end) params['endDate'] = end;
    return this.http.get<GroupStat[]>(`${this.base}/${encodeURIComponent(name)}/groups-statistics`, { params });
  }
}
