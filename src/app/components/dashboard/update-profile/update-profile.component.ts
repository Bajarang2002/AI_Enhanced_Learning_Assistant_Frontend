import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { User } from '../../../models/auth.models';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  profileImage: string = '';
  previewUrl: string | null = null;
  selectedFile: File | null = null;

  isLoading: boolean = false;
  message: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.populateFields(user);
    }

    this.profileService.getProfile().subscribe({
      next: (u) => {
        if (u) {
          this.populateFields(u);
        }
      },
      error: () => {}
    });
  }

  populateFields(user: User): void {
    this.firstName = user.first_name || '';
    this.lastName = user.last_name || '';
    this.email = user.email || '';
    this.profileImage = user.profile_image || 'profile_images/default.png';
  }

  isCustomAvatar(): boolean {
    if (!this.profileImage) return false;
    const lower = this.profileImage.toLowerCase();
    return !lower.includes('default') && (
      lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp')
    );
  }

  getAvatarUrl(): string {
    if (this.previewUrl) return this.previewUrl;
    if (!this.profileImage || this.profileImage.toLowerCase().includes('default')) {
      return '';
    }
    if (this.profileImage.startsWith('http://') || this.profileImage.startsWith('https://')) {
      return this.profileImage;
    }
    return `${environment.staticUrl}/${this.profileImage}`;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  deleteProfilePhoto(): void {
    if (!confirm('Are you sure you want to delete your profile photo?')) return;

    this.profileService.deleteProfileImage().subscribe({
      next: () => {
        this.profileImage = 'profile_images/default.png';
        this.previewUrl = null;
        this.selectedFile = null;
        this.message = 'Profile photo removed successfully.';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to remove profile photo.';
      }
    });
  }

  onSubmit(): void {
    if (!this.firstName || !this.lastName || !this.email) {
      this.errorMessage = 'First Name, Last Name, and Email are required.';
      return;
    }

    this.isLoading = true;
    this.message = null;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('first_name', this.firstName);
    formData.append('last_name', this.lastName);
    formData.append('email', this.email);
    if (this.selectedFile) {
      formData.append('profile_image', this.selectedFile);
    }

    this.profileService.updateProfile(formData).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.populateFields(user);
        this.previewUrl = null;
        this.selectedFile = null;
        this.message = 'Profile updated successfully!';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.detail || err.error?.message || 'Failed to update profile.';
      }
    });
  }
}
