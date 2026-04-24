import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FooterComponent } from '../../components/layout/footer.component';
import { Cart, CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-20">
            <button
              routerLink="/"
              class="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Continue Shopping
            </button>
            <h1 class="text-2xl font-bold">Shopping Cart</h1>
            <div class="w-24"></div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        @if (cart.items.length === 0) {
          <div class="text-center py-20 animate-fade-in">
            <div class="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p class="text-gray-500 mb-6">Looks like you haven't added any items yet</p>
            <button
              routerLink="/"
              class="px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:shadow-lg hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        }

        @if (cart.items.length > 0) {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Cart Items -->
            <div class="lg:col-span-2 space-y-4">
              @for (item of cart.items; track item.product.id) {
                <div class="bg-white rounded-2xl shadow-lg p-6 flex gap-6 animate-fade-in product-card">
                  <div class="relative w-32 h-32 flex-shrink-0">
                    <img
                      [src]="item.product.image"
                      [alt]="item.product.name"
                      class="w-full h-full object-cover rounded-xl"
                    />
                    <span class="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                      {{ item.product.category }}
                    </span>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-lg mb-1">{{ item.product.name }}</h3>
                    <p class="text-gray-500 text-sm mb-3">{{ item.product.description }}</p>
                    <p class="text-2xl font-bold text-black mb-4">\${{ item.product.price.toFixed(2) }}</p>
                    
                    <div class="flex items-center justify-between">
                      <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          (click)="updateQuantity(item.product.id, item.quantity - 1)"
                          [disabled]="item.quantity <= 1"
                          class="px-4 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                          </svg>
                        </button>
                        <span class="px-6 py-2 font-semibold min-w-[60px] text-center">{{ item.quantity }}</span>
                        <button
                          (click)="updateQuantity(item.product.id, item.quantity + 1)"
                          [disabled]="item.quantity >= item.product.stock"
                          class="px-4 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                          </svg>
                        </button>
                      </div>
                      <button
                        (click)="removeFromCart(item.product.id)"
                        class="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors font-medium"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl font-bold text-black">\${{ (item.product.price * item.quantity).toFixed(2) }}</p>
                  </div>
                </div>
              }
            </div>

            <!-- Order Summary -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 class="text-xl font-bold mb-6">Order Summary</h2>
                <div class="space-y-4 mb-6">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Subtotal</span>
                    <span class="font-semibold">\${{ cart.total.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Shipping</span>
                    <span class="font-semibold text-green-600">Free</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Tax (10%)</span>
                    <span class="font-semibold">\${{ (cart.total * 0.1).toFixed(2) }}</span>
                  </div>
                  <div class="border-t-2 border-gray-200 pt-4">
                    <div class="flex justify-between">
                      <span class="font-bold text-lg">Total</span>
                      <span class="font-bold text-2xl text-black">\${{ (cart.total * 1.1).toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Promo Code -->
                <div class="mb-6">
                  <div class="flex gap-2">
                    <input
                      type="text"
                      id="promo-code"
                      name="promo-code"
                      placeholder="Promo Code"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                    <button class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                <button
                  routerLink="/checkout"
                  class="w-full py-4 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl font-semibold hover:from-gray-800 hover:to-black transition-all hover:shadow-lg hover:scale-105"
                >
                  Proceed to Checkout
                </button>
                
                <div class="mt-6 flex items-center justify-center gap-4 text-gray-400">
                  <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                  <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                  </svg>
                </div>
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

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

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
}
