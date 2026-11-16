import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, AuthResponse, SignupRequest, LoginRequest, ChangePasswordRequest } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialUser();
  }

  private loadInitialUser(): void {
    const savedUser = localStorage.getItem('current_user');
    const token = this.getToken();
    if (savedUser && token) {
      try {
        this.currentUserSubject.next(JSON.parse(savedUser));
      } catch (e) {
        this.logout();
      }
    }
  }

  public getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public updateCurrentUser(user: User): void {
    localStorage.setItem('current_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  public signup(data: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, data).pipe(
      tap(res => {
        if (res.success && res.token && res.user) {
          localStorage.setItem('jwt_token', res.token);
          this.updateCurrentUser(res.user);
        }
      })
    );
  }

  public login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        if (res.success && res.token && res.user) {
          localStorage.setItem('jwt_token', res.token);
          this.updateCurrentUser(res.user);
        }
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => {},
      error: () => {}
    });
  }

  public getMe(): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        if (user) {
          this.updateCurrentUser(user);
        }
      }),
      catchError(() => of(null))
    );
  }

  public changePassword(data: ChangePasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, data);
  }

  public forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  public resetPassword(token: string, new_password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, new_password });
  }
}
