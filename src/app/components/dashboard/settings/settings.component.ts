import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService, AppTheme } from '../../../services/theme.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/auth.models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  activeTab: string = 'security';
  currentTheme: AppTheme = 'crimson';

  // Password reset fields
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  pwdSuccessMsg = '';
  pwdErrorMsg = '';
  isPwdLoading = false;

  // Preferences fields
  prefModel: string = 'LSTM';
  prefNoq: number = 5;
  prefStrictness: string = 'balanced';
  prefSavedAlert: boolean = false;

  currentUser: User | null = null;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentTheme = this.themeService.theme;
    this.themeService.currentTheme$.subscribe(t => this.currentTheme = t);

    this.currentUser = this.authService.currentUserValue;
    this.authService.currentUser$.subscribe(u => this.currentUser = u);

    this.loadPreferences();
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  setTheme(theme: AppTheme): void {
    this.themeService.setTheme(theme);
    this.currentTheme = theme;
  }

  onChangePassword(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.pwdErrorMsg = 'Please fill out all password fields.';
      this.pwdSuccessMsg = '';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.pwdErrorMsg = 'New password and confirmation do not match.';
      this.pwdSuccessMsg = '';
      return;
    }

    if (this.newPassword.length < 6) {
      this.pwdErrorMsg = 'Password must be at least 6 characters long.';
      this.pwdSuccessMsg = '';
      return;
    }

    this.isPwdLoading = true;
    this.pwdErrorMsg = '';
    this.pwdSuccessMsg = '';

    this.authService.changePassword({
      current_password: this.currentPassword,
      new_password: this.newPassword
    }).subscribe({
      next: (res) => {
        this.isPwdLoading = false;
        if (res.success) {
          this.pwdSuccessMsg = res.message || 'Password updated successfully!';
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        } else {
          this.pwdErrorMsg = res.error || 'Failed to update password.';
        }
      },
      error: (err) => {
        this.isPwdLoading = false;
        this.pwdErrorMsg = err.error?.detail || err.error?.error || 'Current password is incorrect.';
      }
    });
  }

  loadPreferences(): void {
    this.prefModel = localStorage.getItem('pref_model') || 'LSTM';
    this.prefNoq = parseInt(localStorage.getItem('pref_noq') || '5', 10);
    this.prefStrictness = localStorage.getItem('pref_strictness') || 'balanced';
  }

  savePreferences(): void {
    localStorage.setItem('pref_model', this.prefModel);
    localStorage.setItem('pref_noq', this.prefNoq.toString());
    localStorage.setItem('pref_strictness', this.prefStrictness);

    this.prefSavedAlert = true;
    setTimeout(() => {
      this.prefSavedAlert = false;
    }, 3000);
  }
}
