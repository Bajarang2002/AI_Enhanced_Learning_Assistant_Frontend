import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/auth.models';

import { UploadTrainComponent } from './upload-train/upload-train.component';
import { ModelAccuracyComponent } from './model-accuracy/model-accuracy.component';
import { QuestionGenerationComponent } from './question-generation/question-generation.component';
import { AnswerEvaluationComponent } from './answer-evaluation/answer-evaluation.component';
import { SettingsComponent } from './settings/settings.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

export type DashboardView = 'home' | 'train' | 'accuracy' | 'questions' | 'evaluation' | 'settings' | 'profile';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UploadTrainComponent,
    ModelAccuracyComponent,
    QuestionGenerationComponent,
    AnswerEvaluationComponent,
    SettingsComponent,
    UpdateProfileComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeView: DashboardView = 'home';
  currentUser: User | null = null;
  isDropdownOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
    });

    // Refresh profile in background
    this.authService.getMe().subscribe();
  }

  setView(view: DashboardView): void {
    this.activeView = view;
    this.isDropdownOpen = false;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  isCustomAvatar(): boolean {
    if (!this.currentUser?.profile_image) return false;
    const lower = this.currentUser.profile_image.toLowerCase();
    return !lower.includes('default') && (
      lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp')
    );
  }

  getAvatarUrl(): string {
    if (!this.currentUser?.profile_image) return '';
    if (this.currentUser.profile_image.startsWith('http://') || this.currentUser.profile_image.startsWith('https://')) {
      return this.currentUser.profile_image;
    }
    return `${environment.staticUrl}/${this.currentUser.profile_image}`;
  }

  signOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
