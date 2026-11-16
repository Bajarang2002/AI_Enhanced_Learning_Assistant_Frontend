import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  isSuccess = false;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.params['token'] || '';
    if (!this.token) {
      this.message = 'Invalid password reset token.';
    }
  }

  onSubmit(): void {
    if (!this.newPassword || !this.confirmPassword) {
      this.message = 'Please fill out all fields.';
      this.isSuccess = false;
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Passwords do not match.';
      this.isSuccess = false;
      return;
    }

    if (this.newPassword.length < 6) {
      this.message = 'Password must be at least 6 characters.';
      this.isSuccess = false;
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.message = res.message || 'Password updated successfully! Please login.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.isSuccess = false;
        this.message = err.error?.detail || err.error?.message || 'The password reset link is invalid or has expired.';
      }
    });
  }
}
