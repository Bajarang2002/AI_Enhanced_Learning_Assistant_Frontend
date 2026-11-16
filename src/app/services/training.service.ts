import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TrainingResult } from '../models/model.models';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private apiUrl = `${environment.apiUrl}/training`;

  constructor(private http: HttpClient) {}

  public trainModel(formData: FormData): Observable<TrainingResult> {
    return this.http.post<TrainingResult>(this.apiUrl, formData);
  }
}
