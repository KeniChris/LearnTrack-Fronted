import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PdfReport } from '../../shared/models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private http = inject(HttpClient);

  sendReport(dto: { groupCode: string; collectionName: string; optionalEmail?: string }): Observable<PdfReport> {
    return this.http.post<PdfReport>(`${environment.apiUrl}/reports`, dto);
  }

  getGroupReports(groupCode: string): Observable<PdfReport[]> {
    return this.http.get<PdfReport[]>(`${environment.apiUrl}/groups/${groupCode}/reports`);
  }
}
