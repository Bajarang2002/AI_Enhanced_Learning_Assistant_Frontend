import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrainingService } from '../../../services/training.service';

@Component({
  selector: 'app-upload-train',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-train.component.html',
  styleUrls: ['./upload-train.component.css']
})
export class UploadTrainComponent {
  selectedFile: File | null = null;
  modelType: string = 'LSTM';
  epochs: number = 5;
  batchSize: number = 64;

  isLoading: boolean = false;
  error: string | null = null;
  successMsg: string | null = null;
  results: any = null;

  @Output() viewMetricsRequested = new EventEmitter<void>();

  constructor(private trainingService: TrainingService) {}

  selectAlgo(type: string): void {
    this.modelType = type;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      this.error = 'Please select a valid dataset file to upload.';
      return;
    }

    this.error = null;
    this.successMsg = null;
    this.isLoading = true;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('model_type', this.modelType);
    formData.append('epochs', this.epochs.toString());
    formData.append('batch_size', this.batchSize.toString());

    this.trainingService.trainModel(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.results) {
          this.results = res.results;
          this.successMsg = `Model (${this.modelType}) trained successfully! Final Accuracy: ${res.results.final_accuracy}% | Validation Accuracy: ${res.results.val_accuracy}% | Loss: ${res.results.final_loss}.`;
        } else {
          this.successMsg = res.message || 'Model trained successfully!';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.detail || err.error?.message || 'Error during model training. Please try again.';
      }
    });
  }

  onViewMetrics(): void {
    this.viewMetricsRequested.emit();
  }
}
