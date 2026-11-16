import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../../services/question.service';
import { QuestionItem } from '../../../models/question.models';

@Component({
  selector: 'app-question-generation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question-generation.component.html',
  styleUrls: ['./question-generation.component.css']
})
export class QuestionGenerationComponent {
  inputText = '';
  testType = 'objective';
  noOfQues = 5;

  isLoading = false;
  error: string | null = null;
  questions: QuestionItem[] = [];
  hasGenerated = false;

  @Output() backToDashboard = new EventEmitter<void>();
  @Output() viewAccuracyRequested = new EventEmitter<void>();

  constructor(private questionService: QuestionService) {}

  onSubmit(): void {
    if (!this.inputText.trim()) {
      this.error = 'Please provide content to generate questions.';
      return;
    }

    this.error = null;
    this.isLoading = true;

    this.questionService.generateQuestions(this.inputText, this.testType, this.noOfQues).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.questions = res.questions || [];
        this.hasGenerated = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.detail || err.error?.message || 'Error generating questions. Please try again.';
      }
    });
  }

  generateMore(): void {
    this.hasGenerated = false;
    this.questions = [];
  }

  print(): void {
    window.print();
  }

  onBack(): void {
    this.backToDashboard.emit();
  }

  onViewAccuracy(): void {
    this.viewAccuracyRequested.emit();
  }
}
