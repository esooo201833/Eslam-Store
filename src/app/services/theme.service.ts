import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkMode.asObservable();

  constructor() {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode.next(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.next(prefersDark);
    }
    
    // Apply initial theme
    this.applyTheme();
  }

  toggleTheme(): void {
    const currentTheme = this.isDarkMode.value;
    this.isDarkMode.next(!currentTheme);
    this.applyTheme();
    localStorage.setItem('theme', !currentTheme ? 'dark' : 'light');
  }

  setTheme(isDark: boolean): void {
    this.isDarkMode.next(isDark);
    this.applyTheme();
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  private applyTheme(): void {
    const isDark = this.isDarkMode.value;
    document.documentElement.classList.toggle('dark', isDark);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#1a1a1a' : '#ffffff');
    }
  }

  get currentTheme(): boolean {
    return this.isDarkMode.value;
  }
}
