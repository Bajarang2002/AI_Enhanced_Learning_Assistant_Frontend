import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { QuestionGenResponse } from '../models/question.models';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = `${environment.apiUrl}/questions`;

  constructor(private http: HttpClient) {}

  public generateQuestions(itext: string, test_type: string = 'objective', noq: number = 5): Observable<QuestionGenResponse> {
    return this.http.post<QuestionGenResponse>(`${this.apiUrl}/generate`, {
      itext,
      test_type,
      noq
    });
  }
}
