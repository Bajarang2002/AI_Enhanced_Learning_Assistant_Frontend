import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/auth.models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  public getProfile(): Observable<User> {
    return this.http.get<User>(this.apiUrl);
  }

  public updateProfile(formData: FormData): Observable<User> {
    return this.http.post<User>(this.apiUrl, formData).pipe(
      tap(user => {
        if (user) {
          this.authService.updateCurrentUser(user);
        }
      })
    );
  }

  public deleteProfileImage(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete-image`, {}).pipe(
      tap(() => {
        const cur = this.authService.currentUserValue;
        if (cur) {
          this.authService.updateCurrentUser({
            ...cur,
            profile_image: 'profile_images/default.png'
          });
        }
      })
    );
  }
}
