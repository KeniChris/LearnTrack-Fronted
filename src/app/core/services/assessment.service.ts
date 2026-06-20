import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TopicStat, GroupStat } from '../../shared/models/models';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private http = inject(HttpClient);
  private collectionBase = `${environment.apiUrl}/collections`;

  getCollectionTopicStats(
    collectionName: string,
    startDate?: string,
    endDate?: string
  ): Observable<TopicStat[]> {
    const params: Record<string, string> = {};

    if (startDate) params['startDate'] = startDate;
    if (endDate) params['endDate'] = endDate;

    return this.http.get<TopicStat[]>(
      `${this.collectionBase}/${encodeURIComponent(collectionName)}/statistics`,
      { params }
    );
  }

  getCollectionGroupStats(
    collectionName: string,
    startDate?: string,
    endDate?: string
  ): Observable<GroupStat[]> {
    const params: Record<string, string> = {};

    if (startDate) params['startDate'] = startDate;
    if (endDate) params['endDate'] = endDate;

    return this.http.get<GroupStat[]>(
      `${this.collectionBase}/${encodeURIComponent(collectionName)}/groups-statistics`,
      { params }
    );
  }
}