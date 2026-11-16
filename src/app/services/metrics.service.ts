import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ModelMetrics, TrainingHistoryRun, EpochRecord } from '../models/model.models';

export interface LatestMetricsResponse {
  metrics: ModelMetrics | null;
  history_data: EpochRecord[];
}

export interface HistoryRunsResponse {
  runs: TrainingHistoryRun[];
}

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private apiUrl = `${environment.apiUrl}/metrics`;

  constructor(private http: HttpClient) {}

  public getLatestMetrics(): Observable<LatestMetricsResponse> {
    return this.http.get<LatestMetricsResponse>(`${this.apiUrl}/latest`);
  }

  public getHistoryRuns(): Observable<HistoryRunsResponse> {
    return this.http.get<HistoryRunsResponse>(`${this.apiUrl}/history`);
  }

  public deleteHistoryRun(historyId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/history/${historyId}`);
  }
}
