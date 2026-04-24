import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { PaymentService } from '../../services/payment.service';
import { ToastService } from '../../services/toast.service';
import { FooterComponent } from '../../components/layout/footer.component';
import { Cart } from '../../models/cart.model';
import { LanguageService } from '../../services/language.service';
import { ProductService } from '../../services/product.service';
import { PayPalService } from '../../services/paypal.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FooterComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
      <!-- Header -->
      <header class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-gray-100 dark:border-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-20">
            <button
              routerLink="/cart"
              class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-medium"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              {{ translate('checkout.backToCart') }}
            </button>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ translate('checkout.title') }}</h1>
            <div class="w-24"></div>
          </div>
        </div>
      </header>

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
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <!-- Checkout Form -->
            <div class="space-y-8">
              <!-- Customer Information -->
              <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
                <div class="flex items-center gap-4 mb-8">
                  <div class="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 rounded-2xl flex items-center justify-center shadow-lg">
                    <span class="text-white dark:text-gray-900 font-bold text-lg">1</span>
                  </div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ translate('checkout.customerInfo') }}</h2>
                </div>
                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">{{ translate('checkout.fullName') }}</label>
                    <input
                      type="text"
                      id="full-name"
                      name="full-name"
                      [(ngModel)]="customerName"
                      placeholder="John Doe"
                      class="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">{{ translate('checkout.emailAddress') }}</label>
                    <input
                      id="customer-email"
                      name="customer-email"
                      [(ngModel)]="customerEmail"
                      type="email"
                      placeholder="john@example.com"
                      class="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                    />
                  </div>

                  <!-- Address Section -->
                  <div class="pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">{{ translate('checkout.addressInfo') }}</h3>
                    <div class="space-y-5">
                      <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">{{ translate('checkout.country') }}</label>
                        <select
                          id="country"
                          name="country"
                          [(ngModel)]="selectedCountry"
                          (change)="onCountryChange()"
                          class="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                        >
                          <option value="">{{ translate('checkout.selectCountry') }}</option>
                          @for (country of countries; track country.value) {
                            <option [value]="country.value">{{ country.name }}</option>
                          }
                        </select>
                      </div>

                      @if (selectedCountry) {
                        <div>
                          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">{{ translate('checkout.governorate') }}</label>
                          <select
                            id="governorate"
                            name="governorate"
                            [(ngModel)]="selectedGovernorate"
                            class="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                          >
                            <option value="">{{ translate('checkout.selectGovernorate') }}</option>
                            @for (gov of availableGovernorates; track gov) {
                              <option [value]="gov">{{ gov }}</option>
                            }
                          </select>
                        </div>
                      }

                      <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">{{ translate('checkout.area') }}</label>
                        <input
                          type="text"
                          id="area"
                          name="area"
                          [(ngModel)]="area"
                          placeholder="Enter area name"
                          class="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">{{ translate('checkout.streetName') }}</label>
                        <input
                          type="text"
                          id="street-name"
                          name="street-name"
                          [(ngModel)]="streetName"
                          placeholder="Enter street name"
                          class="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                        />
                      </div>

                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">{{ translate('checkout.buildingNumber') }}</label>
                          <input
                            type="text"
                            id="building-number"
                            name="building-number"
                            [(ngModel)]="buildingNumber"
                            placeholder="Building #"
                            class="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">{{ translate('checkout.floor') }}</label>
                          <input
                            type="text"
                            id="floor"
                            name="floor"
                            [(ngModel)]="floor"
                            placeholder="Floor #"
                            class="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">{{ translate('checkout.apartmentNumber') }}</label>
                        <input
                          type="text"
                          id="apartment-number"
                          name="apartment-number"
                          [(ngModel)]="apartmentNumber"
                          placeholder="Apartment #"
                          class="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payment Method -->
              <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
                <div class="flex items-center gap-4 mb-8">
                  <div class="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 rounded-2xl flex items-center justify-center shadow-lg">
                    <span class="text-white dark:text-gray-900 font-bold text-lg">2</span>
                  </div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ translate('checkout.paymentMethod') }}</h2>
                </div>
                <div class="space-y-4">
                  <label class="flex items-center p-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer hover:border-gray-900 dark:hover:border-white transition-all duration-300 hover:shadow-lg group">
                    <input
                      type="radio"
                      id="payment-cash"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      [(ngModel)]="paymentMethod"
                      class="mr-4 w-6 h-6 text-gray-900 dark:text-white"
                    />
                    <div class="flex-1">
                      <span class="font-bold text-lg text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-gray-200 transition-colors">{{ translate('checkout.cashOnDelivery') }}</span>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ translate('checkout.cashOnDeliveryDesc') }}</p>
                    </div>
                    <div class="w-14 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                  </label>

                  <label class="flex items-center p-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer hover:border-gray-900 dark:hover:border-white transition-all duration-300 hover:shadow-lg group">
                    <input
                      type="radio"
                      id="payment-paypal"
                      name="paymentMethod"
                      value="paypal"
                      [(ngModel)]="paymentMethod"
                      class="mr-4 w-6 h-6 text-gray-900 dark:text-white"
                    />
                    <div class="flex-1">
                      <span class="font-bold text-lg text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-gray-200 transition-colors">{{ translate('checkout.paypal') }}</span>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ translate('checkout.paypalDesc') }}</p>
                    </div>
                    <svg class="w-14 h-9" viewBox="0 0 24 24" fill="#003087">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
                      <path d="M21.977 7.516c-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106h-3.642a.641.641 0 0 1-.633-.74L6.677 4.97c.082-.518.53-.9 1.054-.9h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287z"/>
                    </svg>
                  </label>

                  <label class="flex items-center p-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer hover:border-gray-900 dark:hover:border-white transition-all duration-300 hover:shadow-lg group">
                    <input
                      type="radio"
                      id="payment-stripe"
                      name="paymentMethod"
                      value="stripe"
                      [(ngModel)]="paymentMethod"
                      class="mr-4 w-6 h-6 text-gray-900 dark:text-white"
                    />
                    <div class="flex-1">
                      <span class="font-bold text-lg text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-gray-200 transition-colors">{{ translate('checkout.creditCard') }}</span>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ translate('checkout.creditCardDesc') }}</p>
                    </div>
                    <div class="flex gap-3">
                      <svg class="w-10 h-6" viewBox="0 0 24 24" fill="#1A1F71">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        <path d="M8 12h8v2H8v-2zm0-4h8v2H8V8z"/>
                      </svg>
                      <svg class="w-10 h-6" viewBox="0 0 24 24" fill="#EB001B">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        <path d="M8 12h8v2H8v-2zm0-4h8v2H8V8z"/>
                      </svg>
                    </div>
                  </label>
                </div>

                <!-- PayPal Button Container -->
                @if (paymentMethod === 'paypal') {
                  <div class="mt-6">
                    <div id="paypal-button-container" class="min-h-[50px]"></div>
                  </div>
                }
              </div>

              <!-- Pay Button -->
              @if (paymentMethod !== 'paypal') {
                <button
                  (click)="processPayment()"
                  [disabled]="processing || !customerName || !customerEmail || !paymentMethod"
                  class="w-full py-5 bg-gradient-to-r from-gray-900 to-black dark:from-white dark:to-gray-300 text-white dark:text-gray-900 rounded-2xl font-bold text-lg hover:from-black hover:to-gray-900 dark:hover:from-gray-100 dark:hover:to-gray-400 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                  @if (!processing) {
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <span>{{ translate('checkout.pay') }} $ {{ (cart.total * 1.1).toFixed(2) }}</span>
                  }
                  @if (processing) {
                    <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{{ translate('checkout.processing') }}</span>
                  }
                </button>
              }

              <!-- Security Note -->
              <div class="flex items-center justify-center gap-3 text-gray-400 dark:text-gray-500 text-sm bg-gray-50 dark:bg-gray-800 py-4 rounded-2xl">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <span>{{ translate('checkout.securePayment') }}</span>
              </div>
            </div>

            <!-- Order Summary -->
            <div>
              <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 sticky top-24 transform transition-all duration-500 hover:shadow-2xl">
                <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{{ translate('checkout.orderSummary') }}</h2>
                <div class="space-y-5 mb-6">
                  @for (item of cart.items; track item.product.id) {
                    <div class="flex gap-4 pb-5 border-b border-gray-100 dark:border-gray-700">
                      <img
                        [src]="item.product.image"
                        [alt]="item.product.name"
                        class="w-20 h-20 object-cover rounded-2xl transition-transform duration-300 hover:scale-105"
                      />
                      <div class="flex-1">
                        <h3 class="font-bold text-sm text-gray-900 dark:text-white">{{ item.product.name }}</h3>
                        <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">Qty: {{ item.quantity }}</p>
                      </div>
                      <span class="font-bold text-lg text-gray-900 dark:text-white">$ {{ (getPrice(item.product) * item.quantity).toFixed(2) }}</span>
                    </div>
                  }
                </div>
                <div class="space-y-4 border-t-2 border-gray-200 dark:border-gray-700 pt-6">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-400">{{ translate('checkout.subtotal') }}</span>
                    <span class="font-semibold text-lg text-gray-900 dark:text-white">$ {{ cart.total.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-400">{{ translate('checkout.shipping') }}</span>
                    <span class="font-semibold text-green-600 dark:text-green-400">{{ translate('checkout.free') }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-400">{{ translate('checkout.tax') }}</span>
                    <span class="font-semibold text-gray-900 dark:text-white">$ {{ (cart.total * 0.1).toFixed(2) }}</span>
                  </div>
                  <div class="border-t-2 border-gray-200 dark:border-gray-700 pt-6">
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-xl text-gray-900 dark:text-white">{{ translate('checkout.total') }}</span>
                      <span class="font-bold text-3xl bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        $ {{ (cart.total * 1.1).toFixed(2) }}
                      </span>
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
export class CheckoutComponent implements OnInit, AfterContentChecked {
  cart: Cart = { items: [], total: 0 };
  customerName = '';
  customerEmail = '';
  paymentMethod: 'paypal' | 'stripe' | 'cash_on_delivery' = 'cash_on_delivery';
  processing = false;
  currentLang: 'ar' | 'en' = 'ar';

  // Address fields
  selectedCountry = '';
  selectedGovernorate = '';
  area = '';
  streetName = '';
  buildingNumber = '';
  floor = '';
  apartmentNumber = '';

  countries = [
    { name: 'Egypt', value: 'egypt' },
    { name: 'Saudi Arabia', value: 'saudi' },
    { name: 'Oman', value: 'oman' }
  ];

  governorates: { [key: string]: string[] } = {
    egypt: ['Cairo', 'Alexandria', 'Giza', 'Dakahlia', 'Sharqia', 'Monufia', 'Qalyubia', 'Gharbia', 'Menofia', 'Beheira', 'Ismailia', 'Suez', 'Aswan', 'Assiut', 'Beni Suef', 'Fayoum', 'Luxor', 'Matrouh', 'Minya', 'New Valley', 'North Sinai', 'Port Said', 'Qena', 'Red Sea', 'Sohag', 'South Sinai'],
    saudi: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Tabuk', 'Abha', 'Hail', 'Buraidah', 'Khamis Mushait', 'Taif', 'Najran', 'Jizan', 'Al Hofuf', 'Yanbu', 'Ar Rass', 'Sakaka', 'Al Bahah', 'Jubail'],
    oman: ['Muscat', 'Seeb', 'Salalah', 'Sohar', 'Nizwa', 'Sur', 'Ibra', 'Bawshar', 'Rustaq', 'Haima', 'Al Khaburah', 'Suwayq', 'Ibri', 'Bahla', 'Madha', 'Adam', 'Dibba', 'Al Buraimi', 'Shinas', 'Liwa']
  };

  availableGovernorates: string[] = [];

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private toastService: ToastService,
    private router: Router,
    private languageService: LanguageService,
    private productService: ProductService,
    private paypalService: PayPalService
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
    this.loadPayPal();
  }

  async loadPayPal(): Promise<void> {
    try {
      await this.paypalService.loadPayPalScript();
    } catch (error) {
      console.error('Failed to load PayPal SDK:', error);
    }
  }

  renderPayPalButton(): void {
    if (this.paymentMethod === 'paypal' && this.cart.total > 0) {
      const amount = this.cart.total * 1.1; // Including tax
      this.paypalService.renderPayPalButton('paypal-button-container', amount, (details) => {
        this.onPayPalSuccess(details);
      });
    }
  }

  onPayPalSuccess(details: any): void {
    this.processing = true;
    this.toastService.success('Payment successful!');
    this.cartService.clearCart();
    this.router.navigate(['/']);
    this.processing = false;
  }

  ngAfterContentChecked(): void {
    this.renderPayPalButton();
  }

  onCountryChange(): void {
    this.selectedGovernorate = '';
    this.availableGovernorates = this.governorates[this.selectedCountry] || [];
  }

  async processPayment(): Promise<void> {
    if (!this.customerName || !this.customerEmail || !this.paymentMethod) {
      this.toastService.error('Please fill in all required fields');
      return;
    }

    this.processing = true;

    try {
      if (this.paymentMethod === 'cash_on_delivery') {
        // For cash on delivery, create order directly without payment processing
        const orderId = 'COD_' + Date.now();
        this.toastService.success('Order placed successfully! You will pay on delivery.');
        this.cartService.clearCart();
        this.router.navigate(['/success'], { queryParams: { orderId, method: 'cash_on_delivery' } });
      } else if (this.paymentMethod === 'paypal') {
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

  translate(key: string): string {
    return this.languageService.translate(key);
  }

  getPrice(product: any): number {
    return this.productService.getPriceByCountry(product);
  }
}
