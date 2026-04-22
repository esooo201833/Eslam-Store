import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promo-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="onClose()"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-in">
          <!-- Close Button -->
          <button
            (click)="onClose()"
            class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Content -->
          <div class="grid md:grid-cols-2">
            <!-- Image Side -->
            <div class="relative h-64 md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80"
                alt="Special Offer"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute bottom-4 left-4">
                <span class="inline-block px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-full">
                  LIMITED TIME
                </span>
              </div>
            </div>

            <!-- Text Side -->
            <div class="p-8 flex flex-col justify-center">
              <span class="text-sm font-semibold text-red-600 mb-2">🎉 EXCLUSIVE OFFER</span>
              <h2 class="text-3xl font-bold text-gray-900 mb-4">
                Get 25% OFF
                <span class="block text-2xl font-normal text-gray-600">Your First Order</span>
              </h2>
              <p class="text-gray-600 mb-6">
                Join our premium membership and enjoy exclusive discounts, early access to new products, and free shipping on all orders.
              </p>
              <div class="space-y-3 mb-6">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-700">Free shipping on orders over $100</span>
                </div>
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-700">Exclusive member discounts</span>
                </div>
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-700">Early access to new collections</span>
                </div>
              </div>
              <button
                (click)="onClaim()"
                class="w-full py-4 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl font-semibold hover:from-gray-800 hover:to-black transition-all hover:shadow-lg hover:scale-105"
              >
                Claim Your 25% OFF
              </button>
              <p class="text-center text-xs text-gray-500 mt-4">No credit card required • Cancel anytime</p>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PromoModalComponent {
  @Input() isOpen = false;

  onClose(): void {
    this.isOpen = false;
  }

  onClaim(): void {
    // Handle claim logic
    this.isOpen = false;
    // You can add logic to apply discount or redirect
  }
}
