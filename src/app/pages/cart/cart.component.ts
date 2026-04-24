import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FooterComponent } from '../../components/layout/footer.component';
import { Cart, CartItem } from '../../models/cart.model';
import { LanguageService } from '../../services/language.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
      <!-- Header -->
      <header class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-gray-100 dark:border-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-20">
            <button
              routerLink="/"
              class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-medium"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              {{ translate('cart.continueShopping') }}
            </button>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ translate('cart.title') }}</h1>
            <div class="w-24"></div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        @if (cart.items.length === 0) {
          <div class="text-center py-20 animate-fade-in">
            <div class="w-32 h-32 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg class="w-16 h-16 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ translate('cart.empty') }}</h2>
            <p class="text-gray-500 dark:text-gray-400 mb-6">{{ translate('cart.emptyMessage') }}</p>
            <button
              routerLink="/"
              class="px-8 py-4 bg-black dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all hover:shadow-lg hover:scale-105"
            >
              {{ translate('cart.startShopping') }}
            </button>
          </div>
        }

        @if (cart.items.length > 0) {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Cart Items -->
            <div class="lg:col-span-2 space-y-6">
              @for (item of cart.items; track item.product.id) {
                <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                  <div class="flex gap-6 p-6">
                    <div class="relative w-36 h-36 flex-shrink-0">
                      <img
                        [src]="item.product.image"
                        [alt]="item.product.name"
                        class="w-full h-full object-cover rounded-2xl transition-transform duration-500 hover:scale-105"
                      />
                      <span class="absolute top-3 left-3 px-3 py-1.5 bg-gray-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-gray-900 text-xs font-bold rounded-full uppercase tracking-wider">
                        {{ item.product.category }}
                      </span>
                    </div>
                    <div class="flex-1">
                      <h3 class="font-bold text-xl mb-2 text-gray-900 dark:text-white">{{ item.product.name }}</h3>
                      <p class="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">{{ item.product.description }}</p>
                      <div class="flex items-center justify-between mb-4">
                        <div class="flex flex-col">
                          <span class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">{{ translate('home.price') }}</span>
                          <span class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            $ {{ getPrice(item.product).toFixed(2) }}
                          </span>
                        </div>
                        <div class="flex flex-col text-right">
                          <span class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">{{ translate('cart.total') }}</span>
                          <span class="text-2xl font-bold text-gray-900 dark:text-white">
                            $ {{ (getPrice(item.product) * item.quantity).toFixed(2) }}
                          </span>
                        </div>
                      </div>
                      
                      <div class="flex items-center justify-between">
                        <div class="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                          <button
                            (click)="updateQuantity(item.product.id, item.quantity - 1)"
                            [disabled]="item.quantity <= 1"
                            class="px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                          </button>
                          <span class="px-6 py-3 font-bold text-lg min-w-[70px] text-center text-gray-900 dark:text-white">{{ item.quantity }}</span>
                          <button
                            (click)="updateQuantity(item.product.id, item.quantity + 1)"
                            [disabled]="item.quantity >= item.product.stock"
                            class="px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                          </button>
                        </div>
                        <button
                          (click)="removeFromCart(item.product.id)"
                          class="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-600 dark:hover:bg-red-600 hover:text-white rounded-xl transition-all duration-300 font-semibold transform hover:scale-105"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          {{ translate('cart.remove') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Order Summary -->
            <div class="lg:col-span-1">
              <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 sticky top-24 transform transition-all duration-500 hover:shadow-2xl">
                <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{{ translate('checkout.orderSummary') }}</h2>
                <div class="space-y-5 mb-8">
                  <div class="flex justify-between items-center py-2">
                    <span class="text-gray-600 dark:text-gray-400">{{ translate('cart.subtotal') }}</span>
                    <span class="font-semibold text-lg text-gray-900 dark:text-white">$ {{ cart.total.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-gray-600 dark:text-gray-400">{{ translate('checkout.shipping') }}</span>
                    <span class="font-semibold text-green-600 dark:text-green-400">{{ translate('checkout.free') }}</span>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-gray-600 dark:text-gray-400">{{ translate('checkout.tax') }}</span>
                    <span class="font-semibold text-gray-900 dark:text-white">$ {{ (cart.total * 0.1).toFixed(2) }}</span>
                  </div>
                  <div class="border-t-2 border-gray-200 dark:border-gray-700 pt-5">
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-xl text-gray-900 dark:text-white">{{ translate('cart.total') }}</span>
                      <span class="font-bold text-3xl bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        $ {{ (cart.total * 1.1).toFixed(2) }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- Checkout Button -->
                <button
                  routerLink="/checkout"
                  class="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold text-lg hover:bg-black dark:hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  {{ translate('cart.checkout') }}
                </button>
                
                <!-- Continue Shopping -->
                <button
                  routerLink="/"
                  class="w-full mt-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold transition-colors"
                >
                  {{ translate('cart.continueShopping') }}
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <app-footer></app-footer>
    </div>
  `
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [], total: 0 };
  currentLang: 'ar' | 'en' = 'ar';

  constructor(
    private cartService: CartService,
    private router: Router,
    private languageService: LanguageService,
    private productService: ProductService
  ) {
    this.currentLang = this.languageService.getLanguage();
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  ngOnInit(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  getPrice(product: any): number {
    return this.productService.getPriceByCountry(product);
  }

  translate(key: string): string {
    return this.languageService.translate(key);
  }
}
