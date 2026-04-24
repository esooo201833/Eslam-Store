import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div class="max-w-md w-full">
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
          <div class="text-center mb-8">
            <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify Your Email</h1>
            <p class="text-gray-600 dark:text-gray-400">Enter the 6-digit code sent to your email</p>
          </div>

          @if (email) {
            <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p class="text-sm text-blue-800 dark:text-blue-300">
                <span class="font-medium">Email:</span> {{ email }}
              </p>
            </div>
          }

          <form (ngSubmit)="onSubmit()">
            <div class="mb-6">
              <label class="block text-gray-700 dark:text-gray-300 font-medium mb-2">OTP Code</label>
              <input
                type="text"
                [(ngModel)]="otp"
                name="otp"
                maxlength="6"
                required
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-center text-2xl tracking-widest transition-all"
                placeholder="000000"
                (input)="onOTPInput($event)"
              />
            </div>

            <!-- Error Message -->
            @if (errorMessage) {
              <div class="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
                {{ errorMessage }}
              </div>
            }

            <!-- Success Message -->
            @if (successMessage) {
              <div class="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 rounded-lg">
                {{ successMessage }}
              </div>
            }

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loading || otp.length !== 6"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              @if (loading) {
                <span class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
              }
              Verify Email
            </button>
          </form>

          <!-- Resend OTP -->
          <div class="mt-6 text-center">
            <p class="text-gray-600 dark:text-gray-400 mb-2">Didn't receive the code?</p>
            <button
              (click)="resendOTP()"
              [disabled]="resendLoading || countdown > 0"
              class="text-blue-600 dark:text-blue-400 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (resendLoading) {
                <span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></span>
              }
              @if (countdown > 0) {
                Resend in {{ countdown }}s
              } @else {
                Resend Code
              }
            </button>
          </div>

          <!-- Back to Register -->
          <div class="mt-6 text-center">
            <button
              routerLink="/register"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
            >
              ← Back to Register
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VerifyOtpComponent implements OnInit {
  email = '';
  otp = '';
  loading = false;
  resendLoading = false;
  errorMessage = '';
  successMessage = '';
  countdown = 0;
  countdownInterval: any;
  currentLang: 'ar' | 'en' = 'ar';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private languageService: LanguageService
  ) {
    this.currentLang = this.languageService.getLanguage();
  }

  ngOnInit(): void {
    // Get email from query params or localStorage
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || localStorage.getItem('pendingEmail') || '';
    });

    if (!this.email) {
      this.router.navigate(['/register']);
    }
  }

  onOTPInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Allow only numbers
    input.value = input.value.replace(/[^0-9]/g, '');
    this.otp = input.value;
  }

  onSubmit(): void {
    if (this.otp.length !== 6) {
      this.errorMessage = 'Please enter a valid 6-digit OTP';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService.verifyOTP({ email: this.email, otp: this.otp }).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Email verified successfully!';
        
        // Store token and user
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Clear pending data
        localStorage.removeItem('pendingEmail');
        localStorage.removeItem('pendingName');
        
        // Navigate to products page
        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Invalid OTP. Please try again.';
      }
    });
  }

  resendOTP(): void {
    this.resendLoading = true;
    this.errorMessage = '';

    this.apiService.resendOTP(this.email).subscribe({
      next: (response) => {
        this.resendLoading = false;
        this.successMessage = 'New OTP sent to your email';
        this.startCountdown();
      },
      error: (error) => {
        this.resendLoading = false;
        this.errorMessage = error.error?.message || 'Failed to resend OTP. Please try again.';
      }
    });
  }

  startCountdown(): void {
    this.countdown = 60; // 60 seconds countdown
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}
