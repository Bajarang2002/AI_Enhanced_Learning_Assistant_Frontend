import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvaluationService } from '../../../services/evaluation.service';
import { EvaluationResult } from '../../../models/evaluation.models';

@Component({
  selector: 'app-answer-evaluation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './answer-evaluation.component.html',
  styleUrls: ['./answer-evaluation.component.css']
})
export class AnswerEvaluationComponent {
  refFile: File | null = null;
  refText: string = '';
  studentFile: File | null = null;
  studentText: string = '';

  isLoading: boolean = false;
  error: string | null = null;
  result: EvaluationResult | null = null;

  constructor(private evalService: EvaluationService) {}

  onRefFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.refFile = file;
    }
  }

  onStudentFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.studentFile = file;
    }
  }

  onSubmit(): void {
    if (!this.refFile && !this.refText.trim()) {
      this.error = 'Please upload or paste the Correct Reference Answer Sheet.';
      return;
    }
    if (!this.studentFile && !this.studentText.trim()) {
      this.error = 'Please upload or paste the Student Answer Sheet.';
      return;
    }

    this.error = null;
    this.isLoading = true;

    const formData = new FormData();
    if (this.refFile) formData.append('ref_file', this.refFile);
    if (this.refText) formData.append('ref_text', this.refText);
    if (this.studentFile) formData.append('student_file', this.studentFile);
    if (this.studentText) formData.append('student_text', this.studentText);

    this.evalService.evaluateSheet(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.result = res;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.detail || err.error?.message || 'Evaluation failed. Please try again.';
      }
    });
  }

  resetEvaluation(): void {
    this.result = null;
    this.refFile = null;
    this.refText = '';
    this.studentFile = null;
    this.studentText = '';
    this.error = null;
  }

  print(): void {
    window.print();
  }
}
