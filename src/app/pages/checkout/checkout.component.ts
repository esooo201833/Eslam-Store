import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { PaymentService } from '../../services/payment.service';
import { ToastService } from '../../services/toast.service';
import { NavbarComponent } from '../../components/layout/navbar.component';
import { FooterComponent } from '../../components/layout/footer.component';
import { Cart } from '../../models/cart.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-20">
            <button
              routerLink="/cart"
              class="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Cart
            </button>
            <h1 class="text-2xl font-bold">Checkout</h1>
            <div class="w-24"></div>
          </div>
        </div>
      </header>

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
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Checkout Form -->
            <div class="space-y-6">
              <!-- Customer Information -->
              <div class="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <span class="text-white font-bold">1</span>
                  </div>
                  <h2 class="text-xl font-bold">Customer Information</h2>
                </div>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      id="full-name"
                      name="full-name"
                      [(ngModel)]="customerName"
                      placeholder="John Doe"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      id="customer-email"
                      name="customer-email"
                      [(ngModel)]="customerEmail"
                      type="email"
                      placeholder="john@example.com"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <!-- Payment Method -->
              <div class="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <span class="text-white font-bold">2</span>
                  </div>
                  <h2 class="text-xl font-bold">Payment Method</h2>
                </div>
                <div class="space-y-4">
                  <label class="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-black transition-all [class.selected='border-black']">
                    <input
                      type="radio"
                      id="payment-paypal"
                      name="paymentMethod"
                      value="paypal"
                      [(ngModel)]="paymentMethod"
                      class="mr-4 w-5 h-5 text-black"
                    />
                    <div class="flex-1">
                      <span class="font-semibold text-lg">PayPal</span>
                      <p class="text-sm text-gray-500">Pay with your PayPal account</p>
                    </div>
                    <svg class="w-12 h-8" viewBox="0 0 24 24" fill="#003087">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
                      <path d="M21.977 7.516c-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106h-3.642a.641.641 0 0 1-.633-.74L6.677 4.97c.082-.518.53-.9 1.054-.9h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287z"/>
                    </svg>
                  </label>

                  <label class="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-black transition-all">
                    <input
                      type="radio"
                      id="payment-stripe"
                      name="paymentMethod"
                      value="stripe"
                      [(ngModel)]="paymentMethod"
                      class="mr-4 w-5 h-5 text-black"
                    />
                    <div class="flex-1">
                      <span class="font-semibold text-lg">Credit Card</span>
                      <p class="text-sm text-gray-500">Pay with your credit card</p>
                    </div>
                    <div class="flex gap-2">
                      <svg class="w-8 h-5" viewBox="0 0 24 24" fill="#1A1F71">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        <path d="M8 12h8v2H8v-2zm0-4h8v2H8V8z"/>
                      </svg>
                      <svg class="w-8 h-5" viewBox="0 0 24 24" fill="#EB001B">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        <path d="M8 12h8v2H8v-2zm0-4h8v2H8V8z"/>
                      </svg>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Pay Button -->
              <button
                (click)="processPayment()"
                [disabled]="processing || !customerName || !customerEmail || !paymentMethod"
                class="w-full py-4 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl font-semibold hover:from-gray-800 hover:to-black transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                @if (!processing) {
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  <span>Pay \${{ (cart.total * 1.1).toFixed(2) }}</span>
                }
                @if (processing) {
                  <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing Payment...</span>
                }
              </button>

              <!-- Security Note -->
              <div class="flex items-center justify-center gap-4 text-gray-400 text-sm">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <span>Secure payment powered by industry-standard encryption</span>
              </div>
            </div>

            <!-- Order Summary -->
            <div>
              <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24 animate-fade-in">
                <h2 class="text-xl font-bold mb-6">Order Summary</h2>
                <div class="space-y-4 mb-6">
                  @for (item of cart.items; track item.product.id) {
                    <div class="flex gap-4 pb-4 border-b border-gray-100">
                      <img
                        [src]="item.product.image"
                        [alt]="item.product.name"
                        class="w-16 h-16 object-cover rounded-lg"
                      />
                      <div class="flex-1">
                        <h3 class="font-medium text-sm">{{ item.product.name }}</h3>
                        <p class="text-gray-500 text-xs">Qty: {{ item.quantity }}</p>
                      </div>
                      <span class="font-semibold">\${{ (item.product.price * item.quantity).toFixed(2) }}</span>
                    </div>
                  }
                </div>
                <div class="space-y-3 border-t-2 border-gray-200 pt-4">
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
              </div>
            </div>
          </div>
        </div>
      }

      <app-footer></app-footer>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  cart: Cart = { items: [], total: 0 };
  customerName = '';
  customerEmail = '';
  paymentMethod: 'paypal' | 'stripe' = 'paypal';
  processing = false;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
    });
  }

  async processPayment(): Promise<void> {
    if (!this.customerName || !this.customerEmail || !this.paymentMethod) {
      this.toastService.error('Please fill in all required fields');
      return;
    }

    this.processing = true;

    try {
      if (this.paymentMethod === 'paypal') {
        const result = await this.paymentService.processPayPalPayment(this.cart.total * 1.1);
        if (result.success) {
          this.toastService.success('Payment successful!');
          this.cartService.clearCart();
          this.router.navigate(['/success'], { queryParams: { orderId: result.orderId } });
        } else {
          this.toastService.error(result.error || 'Payment failed');
        }
      } else if (this.paymentMethod === 'stripe') {
        const { clientSecret } = await this.paymentService.createPaymentIntent(this.cart.total * 1.1);
        const result = await this.paymentService.confirmPayment(clientSecret, null);
        if (result.success) {
          this.toastService.success('Payment successful!');
          this.cartService.clearCart();
          this.router.navigate(['/success'], { queryParams: { orderId: 'STRIPE_' + Date.now() } });
        } else {
          this.toastService.error(result.error || 'Payment failed');
        }
      }
    } catch (error) {
      this.toastService.error('An error occurred during payment');
    } finally {
      this.processing = false;
    }
  }
}
