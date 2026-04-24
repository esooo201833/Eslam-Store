import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/layout/navbar.component';
import { FooterComponent } from '../../components/layout/footer.component';
import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
      <!-- Navbar -->
      <app-navbar [showAdmin]="true"></app-navbar>

      <!-- Login Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="max-w-md mx-auto">
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
            <div class="text-center mb-8">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ translate('login.title') }}</h1>
              <p class="text-gray-600 dark:text-gray-400">{{ translate('login.subtitle') }}</p>
            </div>

            <form (ngSubmit)="onSubmit()">
              <!-- Email -->
              <div class="mb-6">
                <label class="block text-gray-700 dark:text-gray-300 font-medium mb-2">{{ translate('login.email') }}</label>
                <input
                  type="email"
                  [(ngModel)]="email"
                  name="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                  placeholder="{{ translate('login.emailPlaceholder') }}"
                />
              </div>

              <!-- Password -->
              <div class="mb-6">
                <label class="block text-gray-700 dark:text-gray-300 font-medium mb-2">{{ translate('login.password') }}</label>
                <input
                  type="password"
                  [(ngModel)]="password"
                  name="password"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                  placeholder="{{ translate('login.passwordPlaceholder') }}"
                />
              </div>

              <!-- Remember Me -->
              <div class="mb-6 flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="rememberMe"
                  name="rememberMe"
                  id="rememberMe"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="rememberMe" class="ml-2 text-gray-700 dark:text-gray-300">{{ translate('login.rememberMe') }}</label>
              </div>

              <!-- Error Message -->
              @if (errorMessage) {
                <div class="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
                  {{ errorMessage }}
                </div>
              }

              <!-- Submit Button -->
              <button
                type="submit"
                [disabled]="loading"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                @if (loading) {
                  <span class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                }
                {{ translate('login.signIn') }}
              </button>
            </form>

            <!-- Register Link -->
            <div class="mt-6 text-center">
              <p class="text-gray-600 dark:text-gray-400">
                {{ translate('login.noAccount') }}
                <a routerLink="/register" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  {{ translate('login.signUp') }}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <app-footer></app-footer>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  loading = false;
  errorMessage = '';
  currentLang: 'ar' | 'en' = 'ar';

  constructor(
    private router: Router,
    private languageService: LanguageService,
    private apiService: ApiService
  ) {
    this.currentLang = this.languageService.getLanguage();
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    this.apiService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('isLoggedIn', 'true');
        this.loading = false;
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || this.translate('login.invalidCredentials');
        this.loading = false;
      }
    });
  }

  translate(key: string): string {
    return this.languageService.translate(key);
  }
}
