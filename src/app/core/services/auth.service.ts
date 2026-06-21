import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { AuthResponse, RegisterDto, User } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenSvc = inject(TokenService);
  private apiUrl = `${environment.apiUrl}/auth`;

  // Signal reactivo para saber si hay sesión activa en cualquier parte de la app
  private loggedInSignal = signal<boolean>(!!this.tokenSvc.getToken());

  isLoggedIn(): boolean {
    return this.loggedInSignal();
  }

  getUser(): User | null {
    return this.tokenSvc.getUser();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        this.tokenSvc.saveToken(response.token);
        this.tokenSvc.saveUser(response.user);
        this.loggedInSignal.set(true);
      })
    );
  }

  register(dto: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, dto);
  }

  logout(): void {
    this.tokenSvc.clear();
    this.loggedInSignal.set(false);
  }
}