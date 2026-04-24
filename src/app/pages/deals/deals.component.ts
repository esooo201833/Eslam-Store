import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { NavbarComponent } from '../../components/layout/navbar.component';
import { FooterComponent } from '../../components/layout/footer.component';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navbar -->
      <app-navbar [showAdmin]="true"></app-navbar>

      <!-- Hero Banner -->
      <section class="relative h-[400px] overflow-hidden">
        <div class="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80"
            alt="Deals Banner"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-red-600/90 to-pink-600/90"></div>
        </div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div class="max-w-2xl animate-fade-in-up">
            <span class="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full mb-4">
              🔥 {{ translate('deals.limitedOffer') }}
            </span>
            <h1 class="text-5xl md:text-6xl font-bold text-white mb-4">
              {{ translate('deals.upToDiscount') }}
            </h1>
            <p class="text-xl text-white/90 mb-8">
              {{ translate('deals.subtitle') }}
            </p>
            <button
              routerLink="/products"
              class="px-8 py-4 bg-white text-red-600 rounded-xl font-bold hover:bg-gray-100 transition-all hover:shadow-xl hover:scale-105"
            >
              {{ translate('deals.shopAllDeals') }}
            </button>
          </div>
        </div>
      </section>

      <!-- Deal Products -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 class="text-3xl font-bold mb-8">{{ translate('deals.hotDeals') }}</h2>
        
        @if (loading) {
          <div class="text-center py-20">
            <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-black"></div>
          </div>
        }

        @if (!loading) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            @for (product of dealProducts; track product.id) {
              <div class="product-card bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer relative" (click)="goToProduct(product.id)">
                <div class="absolute top-4 left-4 z-10">
                  <span class="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    -{{ getDiscount(product) }}%
                  </span>
                </div>
                <div class="relative overflow-hidden">
                  <img
                    [src]="product.image"
                    [alt]="product.name"
                    class="w-full h-64 object-cover"
                  />
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      (click)="addToCart($event, product)"
                      class="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
                    >
                      {{ translate('home.addToCart') }}
                    </button>
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="text-lg font-semibold mb-2 line-clamp-1">{{ product.name }}</h3>
                  <div class="flex items-center gap-2 mb-4">
                    <span class="text-2xl font-bold text-red-600">$ {{ getSalePrice(product).toFixed(2) }}</span>
                    <span class="text-lg text-gray-400 line-through">$ {{ getPrice(product).toFixed(2) }}</span>
                  </div>
                  <button
                    (click)="addToCart($event, product)"
                    class="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all"
                  >
                    {{ translate('home.addToCart') }}
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </section>

      <!-- Countdown Timer -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-gradient-to-r from-black to-gray-800 rounded-2xl p-8 text-center text-white">
          <h2 class="text-2xl font-bold mb-4">⚡ {{ translate('deals.flashSaleEnds') }}</h2>
          <div class="flex justify-center gap-4">
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[80px]">
              <span class="text-4xl font-bold">{{ hours }}</span>
              <p class="text-sm text-gray-300">{{ translate('deals.hours') }}</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[80px]">
              <span class="text-4xl font-bold">{{ minutes }}</span>
              <p class="text-sm text-gray-300">{{ translate('deals.minutes') }}</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[80px]">
              <span class="text-4xl font-bold">{{ seconds }}</span>
              <p class="text-sm text-gray-300">{{ translate('deals.seconds') }}</p>
            </div>
          </div>
        </div>
      </section>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class DealsComponent implements OnInit {
  dealProducts: Product[] = [];
  loading = true;
  hours = 23;
  minutes = 0;
  seconds = 0;
  private countdownInterval: any;
  currentLang: 'ar' | 'en' = 'ar';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private languageService: LanguageService
  ) {
    this.currentLang = this.languageService.getLanguage();
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  ngOnInit(): void {
    this.loadDealProducts();
    this.loadSavedTimer();
    this.startCountdown();
  }

  loadSavedTimer(): void {
    // Clear old localStorage to start fresh with 9 hours
    localStorage.removeItem('flashSaleEndTime');
    this.resetTimer();
  }

  resetTimer(): void {
    const endTime = Date.now() + (9 * 60 * 60 * 1000);
    localStorage.setItem('flashSaleEndTime', endTime.toString());
    this.hours = 9;
    this.minutes = 0;
    this.seconds = 0;
  }

  loadDealProducts(): void {
    this.productService.getProducts().subscribe(products => {
      // Select products with higher prices for deals
      this.dealProducts = products.filter(p => p.price > 200).slice(0, 8);
      this.loading = false;
    });
  }

  getDiscount(product: Product): number {
    return Math.round((product.price * 0.3) / product.price * 100);
  }

  getSalePrice(product: Product): number {
    return this.getPrice(product) * 0.7;
  }

  goToProduct(id: string): void {
    this.router.navigate(['/product', id]);
  }

  addToCart(event: Event, product: Product): void {
    event.stopPropagation();
    const price = this.getSalePrice(product);
    this.cartService.addToCart(product, price);
  }

  startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      this.seconds--;
      if (this.seconds < 0) {
        this.seconds = 59;
        this.minutes--;
        if (this.minutes < 0) {
          this.minutes = 59;
          this.hours--;
          if (this.hours < 0) {
            this.resetTimer();
          }
        }
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  translate(key: string): string {
    return this.languageService.translate(key);
  }

  getPrice(product: Product): number {
    return this.productService.getPriceByCountry(product);
  }
}
