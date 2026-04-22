import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <!-- Header -->
    <header class="glass shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <h1 class="text-xl font-bold text-gradient">Eslam Store</h1>
            </div>

            <!-- Navigation -->
            <nav class="hidden md:flex items-center gap-8">
              <a
                routerLink="/"
                class="nav-link text-gray-700 hover:text-black font-medium transition-all relative group"
            >
              Home
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              routerLink="/products"
              class="nav-link text-gray-700 hover:text-black font-medium transition-all relative group"
            >
              Products
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              routerLink="/categories"
              class="nav-link text-gray-700 hover:text-black font-medium transition-all relative group"
            >
              Categories
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              routerLink="/deals"
              class="nav-link text-gray-700 hover:text-black font-medium transition-all relative group"
            >
              Deals
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-4">
            <!-- Search -->
            <button
              (click)="toggleSearch()"
              class="p-2 text-gray-600 hover:text-black transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>

            <!-- Wishlist -->
            <button
              (click)="toggleWishlist()"
              class="relative p-2 text-gray-600 hover:text-black transition-colors"
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

            <!-- Cart -->
            <button
              routerLink="/cart"
              class="relative p-2 text-gray-600 hover:text-black transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              @if (cartItemCount > 0) {
                <span
                  class="absolute -top-1 -right-1 bg-gradient-to-r from-black to-gray-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                >
                  {{ cartItemCount }}
                </span>
              }
            </button>

            <!-- Admin -->
            @if (showAdmin) {
              <button
                routerLink="/admin"
                class="hidden md:block px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all hover:shadow-lg"
              >
                Admin
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Search Modal -->
      @if (isSearchOpen) {
        <div class="absolute inset-x-0 top-full bg-white shadow-xl border-b border-gray-200 animate-fade-in">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex items-center gap-4">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type="text"
                id="navbar-search"
                name="navbar-search"
                [(ngModel)]="searchQuery"
                placeholder="Search products..."
                (keyup.enter)="performSearch()"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
              <button
                (click)="toggleSearch()"
                class="p-2 text-gray-400 hover:text-black transition-colors"
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
  @Output() search = new EventEmitter<string>();

  cartItemCount = 0;
  wishlistCount = 0;
  isSearchOpen = false;
  searchQuery = '';
  wishlist: string[] = [];

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
    this.loadCartCount();
    this.loadWishlist();
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
}
