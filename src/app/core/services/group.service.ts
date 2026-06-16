import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group, Student, StudentLearningPath } from '../../shared/models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GroupService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/groups`;

  getMyGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.base}/mine`);
  }

  create(dto: { name: string; code: string }): Observable<Group> {
    return this.http.post<Group>(this.base, dto);
  }

  getByCode(code: string): Observable<Group> {
    return this.http.get<Group>(`${this.base}/${code}`);
  }

  getStudents(groupCode: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.base}/${groupCode}/students`);
  }

  enrollStudents(groupCode: string, emails: string[]): Observable<Student[]> {
    return this.http.post<Student[]>(`${this.base}/${groupCode}/enroll`, emails);
  }

  getLearningPaths(groupCode: string): Observable<StudentLearningPath[]> {
    return this.http.get<StudentLearningPath[]>(`${environment.apiUrl}/groups/${groupCode}/learning-paths`);
  }
}
