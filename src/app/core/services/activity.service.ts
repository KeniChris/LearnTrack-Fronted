import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity, FlashcardSet } from '../../shared/models/activity.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private http = inject(HttpClient);

  // Quizzes (ActivityController)
  getByTopic(topicId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${environment.apiUrl}/topics/${topicId}/activities`);
  }

  createQuiz(topicId: number, dto: Activity): Observable<Activity> {
    return this.http.post<Activity>(`${environment.apiUrl}/topics/${topicId}/activities`, dto);
  }

  deleteActivity(activityId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/activities/${activityId}`);
  }

  // Flashcards (FlashcardController)
  createFlashcardSet(topicId: number, dto: FlashcardSet): Observable<FlashcardSet> {
    return this.http.post<FlashcardSet>(`${environment.apiUrl}/topics/${topicId}/flashcards`, dto);
  }

  // IA (AI Controller)
  // Sube el PDF/Docx al backend para que Ollama lo procese
  uploadFileForAI(topicId: number, file: File, activityType: 'QUIZ' | 'FLASHCARD'): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', activityType);
    
    return this.http.post(`${environment.apiUrl}/ai/topics/${topicId}/generate`, formData);
  }
}