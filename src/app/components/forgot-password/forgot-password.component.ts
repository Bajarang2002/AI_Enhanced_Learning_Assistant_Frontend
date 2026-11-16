import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  isSuccess = false;
  isLoading = false;
  resetUrl = '';

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (!this.email) {
      this.message = 'Please enter your registered email.';
      this.isSuccess = false;
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.resetUrl = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.message = res.message || 'Password reset link sent to your email.';
        if (res.reset_url) {
          this.resetUrl = res.reset_url;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.isSuccess = false;
        this.message = err.error?.detail || err.error?.message || 'Email not found or error sending link.';
      }
    });
  }
}
