import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  showBackToTop = false;
  activeSection = 'home';
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user || this.authService.isLoggedIn();
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 40;
    this.showBackToTop = window.scrollY > 200;

    const scrollPos = window.scrollY + 140;
    const aboutSec = document.getElementById('about');
    const contactSec = document.getElementById('contact');

    if (contactSec && scrollPos >= contactSec.offsetTop) {
      this.activeSection = 'contact';
    } else if (aboutSec && scrollPos >= aboutSec.offsetTop) {
      this.activeSection = 'about';
    } else {
      this.activeSection = 'home';
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  scrollTo(elementId: string): void {
    this.closeMobileMenu();
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
  }
}
