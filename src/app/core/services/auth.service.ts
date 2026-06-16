import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  private _loggedIn = signal(!!localStorage.getItem('token'));

  isLoggedIn(): boolean {
    return this._loggedIn();
  }

  register(dto: { firstName: string; lastName: string; email: string; password: string; roleName: string }): Observable<string> {
    return this.http.post(this.apiUrl + '/register', dto, { responseType: 'text' }).pipe(
      tap(token => {
        localStorage.setItem('token', token);
        this._loggedIn.set(true);
      }),
    );
  }

  login(email: string, password: string): Observable<string> {
    return this.http.post(this.apiUrl + '/login', { email, password }, { responseType: 'text' }).pipe(
      tap(token => {
        localStorage.setItem('token', token);
        this._loggedIn.set(true);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._loggedIn.set(false);
  }

  getUser(): { email: string; name: string; role: string } | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
