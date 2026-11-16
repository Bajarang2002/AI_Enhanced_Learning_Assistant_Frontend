import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EvaluationResult } from '../models/evaluation.models';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = `${environment.apiUrl}/evaluation`;

  constructor(private http: HttpClient) {}

  public evaluateSheet(formData: FormData): Observable<EvaluationResult> {
    return this.http.post<EvaluationResult>(`${this.apiUrl}/evaluate`, formData);
  }

  public getHistory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/history`);
  }
}
