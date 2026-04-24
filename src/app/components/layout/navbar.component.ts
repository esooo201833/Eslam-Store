import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { NgOptimizedImage } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgOptimizedImage],
  template: `
    <!-- Header -->
    <header class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl sticky top-0 z-50 border-b border-gray-100/50 dark:border-gray-800/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-20">
            <!-- Logo -->
            <div class="flex items-center gap-3 group cursor-pointer" routerLink="/">
              <div class="relative">
                <img
                  ngSrc="/logo2.png"
                  width="56"
                  height="56"
                  alt="Eslam Store Logo"
                  class="w-14 h-14 object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <div class="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:from-black group-hover:to-gray-800 dark:group-hover:from-gray-100 dark:group-hover:to-gray-400 transition-all duration-300">
                Eslam Store
              </h1>
            </div>

            <!-- Mobile Menu Button -->
            <button
              (click)="toggleMobileMenu()"
              class="md:hidden p-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300"
            >
              @if (isMobileMenuOpen) {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              } @else {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              }
            </button>

            <!-- Navigation -->
            <nav class="hidden md:flex items-center gap-10">
              <a
                routerLink="/"
                class="nav-link text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold transition-all relative group py-2"
            >
              {{ translate('nav.home') }}
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              routerLink="/products"
              class="nav-link text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold transition-all relative group py-2"
            >
              {{ translate('nav.products') }}
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              routerLink="/categories"
              class="nav-link text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold transition-all relative group py-2"
            >
              {{ translate('nav.categories') }}
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              routerLink="/deals"
              class="nav-link text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold transition-all relative group py-2"
            >
              {{ translate('nav.deals') }}
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              routerLink="/about"
              class="nav-link text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold transition-all relative group py-2"
            >
              {{ translate('nav.about') }}
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          <!-- Actions -->
          <div class="hidden md:flex items-center gap-5">
            <!-- Search -->
            <button
              (click)="toggleSearch()"
              class="p-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 transform hover:scale-110"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>

            <!-- Wishlist -->
            <button
              (click)="toggleWishlist()"
              class="relative p-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 transform hover:scale-110"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              @if (wishlistCount > 0) {
                <span
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                >
                  {{ wishlistCount }}
                </span>
              }
            </button>

            <!-- Language Switcher -->
            <button
              (click)="toggleLanguage()"
              class="p-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 transform hover:scale-110"
              title="Change Language"
            >
              <span class="font-bold text-lg">{{ currentLang === 'ar' ? 'EN' : 'ع' }}</span>
            </button>

            <!-- Dark Mode Toggle -->
            @if (!isAdminPanel) {
              <button
                (click)="toggleTheme()"
                class="p-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 transform hover:scale-110"
                title="Toggle Dark Mode"
              >
                @if (isDarkMode) {
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                } @else {
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                  </svg>
                }
              </button>
            }

            <!-- Cart -->
            <button
              routerLink="/cart"
              class="relative p-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 transform hover:scale-110"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              @if (cartItemCount > 0) {
                <span
                  class="absolute -top-1 -right-1 bg-gradient-to-r from-gray-900 to-black dark:from-white dark:to-gray-300 text-white dark:text-gray-900 text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg"
                >
                  {{ cartItemCount }}
                </span>
              }
            </button>

            <!-- User Login/Logout -->
            @if (isLoggedIn) {
              <button
                (click)="logout()"
                class="p-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 transform hover:scale-110"
                title="Logout"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            } @else {
              <button
                routerLink="/login"
                class="p-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 transform hover:scale-110"
                title="Login"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      @if (isMobileMenuOpen) {
        <div class="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 animate-fade-in">
          <div class="px-4 py-4 space-y-3">
            <a
              routerLink="/"
              (click)="toggleMobileMenu()"
              class="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold py-2"
            >
              {{ translate('nav.home') }}
            </a>
            <a
              routerLink="/products"
              (click)="toggleMobileMenu()"
              class="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold py-2"
            >
              {{ translate('nav.products') }}
            </a>
            <a
              routerLink="/categories"
              (click)="toggleMobileMenu()"
              class="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold py-2"
            >
              {{ translate('nav.categories') }}
            </a>
            <a
              routerLink="/deals"
              (click)="toggleMobileMenu()"
              class="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold py-2"
            >
              {{ translate('nav.deals') }}
            </a>
            <a
              routerLink="/about"
              (click)="toggleMobileMenu()"
              class="block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold py-2"
            >
              {{ translate('nav.about') }}
            </a>
            <hr class="border-gray-200 dark:border-gray-800 my-4">
            <div class="flex items-center gap-4">
              <button
                (click)="toggleSearch(); toggleMobileMenu()"
                class="flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                {{ translate('nav.search') }}
              </button>
              <button
                routerLink="/cart"
                (click)="toggleMobileMenu()"
                class="flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                {{ translate('nav.cart') }}
                @if (cartItemCount > 0) {
                  <span class="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {{ cartItemCount }}
                  </span>
                }
              </button>
              @if (isLoggedIn) {
                <button
                  (click)="logout(); toggleMobileMenu()"
                  class="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Logout
                </button>
              } @else {
                <button
                  routerLink="/login"
                  (click)="toggleMobileMenu()"
                  class="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                  Login
                </button>
              }
            </div>
          </div>
        </div>
      }

      <!-- Search Modal -->
      @if (isSearchOpen) {
        <div class="absolute inset-x-0 top-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-200 dark:border-gray-800 animate-fade-in">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="flex items-center gap-4">
              <svg class="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type="text"
                id="navbar-search"
                name="navbar-search"
                [(ngModel)]="searchQuery"
                placeholder="Search products..."
                (keyup.enter)="performSearch()"
                class="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
              />
              <button
                (click)="toggleSearch()"
                class="p-2 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      }
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NavbarComponent {
  @Input() showAdmin = true;
  @Input() isAdminPanel = false;
  @Output() search = new EventEmitter<string>();

  cartItemCount = 0;
  wishlistCount = 0;
  isSearchOpen = false;
  searchQuery = '';
  wishlist: string[] = [];
  currentLang: 'ar' | 'en' = 'ar';
  isDarkMode = false;
  isLoggedIn = false;
  isMobileMenuOpen = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private languageService: LanguageService,
    private themeService: ThemeService
  ) {
    this.loadCartCount();
    this.loadWishlist();
    this.checkLoginStatus();
    this.currentLang = this.languageService.getLanguage();
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });
    this.isDarkMode = this.themeService.currentTheme;
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  checkLoginStatus(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  loadCartCount(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cartItemCount = cart.items.length;
    });
  }

  loadWishlist(): void {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      this.wishlist = JSON.parse(saved);
      this.wishlistCount = this.wishlist.length;
    }
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
    if (this.isSearchOpen) {
      setTimeout(() => {
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (input) input.focus();
      }, 100);
    }
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.search.emit(this.searchQuery);
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery } });
      this.isSearchOpen = false;
      this.searchQuery = '';
    }
  }

  toggleWishlist(): void {
    // Navigate to products page with wishlist filter
    this.router.navigate(['/products'], { queryParams: { wishlist: 'true' } });
  }

  toggleLanguage(): void {
    const newLang = this.currentLang === 'ar' ? 'en' : 'ar';
    this.languageService.setLanguage(newLang);
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.router.navigate(['/home']);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  translate(key: string): string {
    return this.languageService.translate(key);
  }
}
