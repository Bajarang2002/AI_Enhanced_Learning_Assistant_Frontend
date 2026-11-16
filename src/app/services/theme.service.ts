import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AppTheme = 'crimson' | 'indigo' | 'ocean' | 'minimal';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<AppTheme>('crimson');
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    const saved = (localStorage.getItem('app_theme') as AppTheme) || 'crimson';
    this.setTheme(saved);
  }

  public get theme(): AppTheme {
    return this.currentThemeSubject.value;
  }

  public setTheme(themeName: AppTheme): void {
    this.currentThemeSubject.next(themeName);
    localStorage.setItem('app_theme', themeName);
    document.documentElement.setAttribute('data-theme', themeName);
    document.body.setAttribute('data-theme', themeName);
  }
}
