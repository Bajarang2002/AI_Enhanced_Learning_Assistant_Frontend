import { Component, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { MetricsService } from '../../../services/metrics.service';
import { ModelMetrics, TrainingHistoryRun, EpochRecord } from '../../../models/model.models';

Chart.register(...registerables);

@Component({
  selector: 'app-model-accuracy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './model-accuracy.component.html',
  styleUrls: ['./model-accuracy.component.css']
})
export class ModelAccuracyComponent implements OnInit, AfterViewInit, OnDestroy {
  metrics: ModelMetrics | null = null;
  historyRuns: TrainingHistoryRun[] = [];
  historyData: EpochRecord[] = [];
  isLoading = true;

  @ViewChild('accuracyChart') accuracyChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lossChart') lossChartRef!: ElementRef<HTMLCanvasElement>;

  private accuracyChartInstance: Chart | null = null;
  private lossChartInstance: Chart | null = null;

  @Output() trainNewRequested = new EventEmitter<void>();
  @Output() generateQRequested = new EventEmitter<void>();

  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  ngAfterViewInit(): void {
    // Chart will be initialized after data loads
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  private destroyCharts(): void {
    if (this.accuracyChartInstance) {
      this.accuracyChartInstance.destroy();
      this.accuracyChartInstance = null;
    }
    if (this.lossChartInstance) {
      this.lossChartInstance.destroy();
      this.lossChartInstance = null;
    }
  }

  fetchData(): void {
    this.isLoading = true;
    this.metricsService.getLatestMetrics().subscribe({
      next: (res) => {
        this.metrics = res.metrics;
        this.historyData = res.history_data || [];
        this.isLoading = false;

        this.metricsService.getHistoryRuns().subscribe({
          next: (histRes) => {
            this.historyRuns = histRes.runs || [];
          },
          error: () => {}
        });

        setTimeout(() => {
          this.initCharts();
        }, 50);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  initCharts(): void {
    if (!this.historyData || this.historyData.length === 0) return;
    this.destroyCharts();

    const labels = this.historyData.map(item => `Epoch ${item.epoch}`);
    const trainAcc = this.historyData.map(item => item.train_acc);
    const valAcc = this.historyData.map(item => item.val_acc);
    const trainLoss = this.historyData.map(item => item.train_loss);
    const valLoss = this.historyData.map(item => item.val_loss);

    if (this.accuracyChartRef) {
      const ctxAcc = this.accuracyChartRef.nativeElement.getContext('2d');
      if (ctxAcc) {
        this.accuracyChartInstance = new Chart(ctxAcc, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Training Accuracy (%)',
                data: trainAcc,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                fill: true,
                tension: 0.3,
                borderWidth: 2
              },
              {
                label: 'Validation Accuracy (%)',
                data: valAcc,
                borderColor: '#17a2b8',
                backgroundColor: 'rgba(23, 162, 184, 0.1)',
                fill: true,
                tension: 0.3,
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false,
                suggestedMin: 60,
                suggestedMax: 100,
                ticks: { callback: v => v + '%' }
              }
            }
          }
        });
      }
    }

    if (this.lossChartRef) {
      const ctxLoss = this.lossChartRef.nativeElement.getContext('2d');
      if (ctxLoss) {
        this.lossChartInstance = new Chart(ctxLoss, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Training Loss',
                data: trainLoss,
                borderColor: '#800000',
                backgroundColor: 'rgba(128, 0, 0, 0.08)',
                fill: true,
                tension: 0.3,
                borderWidth: 2
              },
              {
                label: 'Validation Loss',
                data: valLoss,
                borderColor: '#ffc107',
                backgroundColor: 'rgba(255, 193, 7, 0.08)',
                fill: true,
                tension: 0.3,
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false
              }
            }
          }
        });
      }
    }
  }

  deleteHistoryRun(runId: number): void {
    if (!confirm('Are you sure you want to delete this training history record?')) {
      return;
    }

    this.metricsService.deleteHistoryRun(runId).subscribe({
      next: () => {
        this.historyRuns = this.historyRuns.filter(r => r.id !== runId);
      },
      error: (err) => {
        alert(err.error?.message || 'Error deleting training record.');
      }
    });
  }

  onTrainNew(): void {
    this.trainNewRequested.emit();
  }

  onGenerateQ(): void {
    this.generateQRequested.emit();
  }
}
