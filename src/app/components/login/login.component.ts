import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  remember = true;
  showPassword = false;
  errorMessage = '';
  isLoading = false;
  returnUrl = '/dashboard';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login({
      username: this.username,
      password: this.password,
      remember: this.remember
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.errorMessage = res.message || 'Login failed.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.detail || err.error?.message || 'Invalid username or password!';
      }
    });
  }
}
