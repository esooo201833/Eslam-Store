import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { PromoModalComponent } from '../../components/ui/promo-modal.component';
import { NavbarComponent } from '../../components/layout/navbar.component';
import { FooterComponent } from '../../components/layout/footer.component';
import { LanguageService } from '../../services/language.service';
import { CountryService } from '../../services/country.service';
import { CountryModalComponent } from '../../components/ui/country-modal.component';
import { interval, take } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, PromoModalComponent, NavbarComponent, FooterComponent, CountryModalComponent],
  template: `
    <div class="min-h-screen flex flex-col" style="background-color: var(--color-bg-secondary)">
      <!-- Navbar -->
      <app-navbar [showAdmin]="true"></app-navbar>

      <!-- Hero Section -->
      <section class="relative h-[600px] overflow-hidden flex-shrink-0 -mt-16">
        <div class="absolute inset-0 animate-slideshow">
          <img
            [src]="backgroundImages[0]"
            alt="Hero Background"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>
        <div class="absolute inset-0 animate-slideshow-2">
          <img
            [src]="backgroundImages[1]"
            alt="Hero Background"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>
        <div class="absolute inset-0 animate-slideshow-3">
          <img
            [src]="backgroundImages[2]"
            alt="Hero Background"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>
        <div class="absolute inset-0 animate-slideshow-4">
          <img
            [src]="backgroundImages[3]"
            alt="Hero Background"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>

        <!-- Slide Indicators -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
          @for (image of backgroundImages; track image; let i = $index) {
            <button
              (click)="goToSlide(i)"
              class="w-3 h-3 rounded-full transition-all"
              [class.bg-white]="currentSlide === i"
              [class.bg-white/50]="currentSlide !== i"
              [class.w-8]="currentSlide === i"
            ></button>
          }
        </div>

        <!-- Navigation Arrows -->
        <button
          (click)="prevSlide()"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-all z-10"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button
          (click)="nextSlide()"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-all z-10"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div class="max-w-2xl animate-fade-in-up">
            <span class="inline-block px-4 py-2 badge badge-accent mb-6 shadow-lg">
              ✨ {{ translate('home.newCollection') }}
            </span>
            <h2 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {{ translate('home.heroTitle') }}
              <span class="block text-gradient-gold">Shopping</span>
            </h2>
            <p class="text-xl text-gray-200 mb-8 leading-relaxed">
              {{ translate('home.heroSubtitle') }}
            </p>
            <div class="flex flex-wrap gap-4">
              <button
                routerLink="/products"
                class="btn-modern btn-modern-primary px-8 py-4 text-white rounded-xl font-bold"
              >
                {{ translate('home.shopNow') }}
              </button>
              <button
                routerLink="/deals"
                class="btn-modern btn-modern-accent px-8 py-4 text-white rounded-xl font-bold"
              >
                {{ translate('home.viewDeals') }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Search and Filter -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div class="glass-card rounded-2xl shadow-2xl p-6 mb-12">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1 relative">
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type="text"
                id="search-input"
                name="search"
                placeholder="{{ translate('home.searchPlaceholder') }}"
                (input)="onSearch($event)"
                class="input-modern pl-12"
              />
            </div>
            <select
              id="home-category"
              name="home-category"
              (change)="onCategoryChange($event)"
              class="input-modern cursor-pointer"
            >
              <option value="all">{{ translate('home.allCategories') }}</option>
              @for (category of categories; track category) {
                <option [value]="category">
                  {{ translateCategory(category) }}
                </option>
              }
            </select>
          </div>
        </div>

        <!-- Category Pills -->
        <div class="flex flex-wrap gap-3 mb-8">
          <button
            (click)="filterByCategory('all')"
            class="badge badge-primary px-6 py-2 text-sm"
          >
            {{ translate('home.all') }}
          </button>
          @for (category of categories; track category) {
            <button
              (click)="filterByCategory(category)"
              class="badge px-6 py-2 text-sm bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-500 hover:text-indigo-500 transition-all"
            >
              {{ translateCategory(category) }}
            </button>
          }
        </div>

        <!-- Products Grid -->
        @if (loading) {
          <div class="text-center py-20">
            <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-black"></div>
            <p class="mt-4 text-gray-600">{{ translate('home.loading') }}</p>
          </div>
        }

        @if (!loading) {
          <div class="relative min-h-screen">
            <!-- Background - Changed to a more noticeable gradient -->
            <div class="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 scroll-reveal">
              @for (product of filteredProducts; track product.id) {
                <div
                  class="relative bg-white rounded-3xl shadow-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-3 border-2 border-indigo-100 hover:border-indigo-300"
                  (click)="goToProduct(product.id)"
                >
                  <!-- Image Container -->
                  <div class="relative overflow-hidden h-72">
                    <img
                      [src]="product.image"
                      [alt]="product.name"
                      class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    <!-- Gradient Overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <!-- Category Badge -->
                    <div class="absolute top-4 left-4">
                      <span class="px-4 py-2 bg-white/95 backdrop-blur-md text-xs font-bold text-gray-800 rounded-full shadow-lg uppercase tracking-wider">
                        {{ translateCategory(product.category) }}
                      </span>
                    </div>
                    
                    <!-- Wishlist Button -->
                    <button
                      (click)="toggleWishlist($event, product)"
                      class="absolute top-4 right-4 p-3 bg-white/95 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white z-20"
                      [class.bg-red-50]="isInWishlist(product.id)"
                      [class.bg-white/95]="!isInWishlist(product.id)"
                    >
                      <svg class="w-5 h-5 transition-colors duration-300" [class.text-red-500]="isInWishlist(product.id)" [class.text-gray-400]="!isInWishlist(product.id)" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                    
                    <!-- Quick Add Button -->
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <button
                        (click)="addToCart(product)"
                        class="px-8 py-3 bg-white text-gray-900 font-bold rounded-2xl shadow-2xl hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:scale-105"
                      >
                        {{ translate('home.addToCart') }}
                      </button>
                    </div>
                  </div>
                  
                  <!-- Content -->
                  <div class="p-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-black transition-colors">
                      {{ product.name }}
                    </h3>
                    <p class="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {{ product.description }}
                    </p>
                    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div class="flex flex-col">
                        <span class="text-xs text-gray-400 uppercase tracking-wider">{{ translate('home.price') }}</span>
                        <span class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                          $ {{ getPrice(product).toFixed(2) }}
                        </span>
                      </div>
                      <button
                        (click)="addToCart(product)"
                        class="p-3 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-black hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        @if (!loading && filteredProducts.length === 0) {
          <div class="text-center py-20">
            <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-gray-500 text-lg mb-4">{{ translate('home.noProducts') }}</p>
            <button
              (click)="filterByCategory('all')"
              class="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              {{ translate('home.viewAllProducts') }}
            </button>
          </div>
        }
      </section>

      <app-footer></app-footer>

      <!-- Promo Modal -->
      <app-promo-modal [isOpen]="showPromoModal" (onClose)="showPromoModal = false"></app-promo-modal>

      <!-- Country Selection Modal -->
      <app-country-modal [isOpen]="showCountryModal" (onClose)="showCountryModal = false"></app-country-modal>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  loading = true;
  cartItemCount = 0;
  showPromoModal = true;
  currentSlide = 0;
  backgroundImages = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1920&q=80',
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1920&q=80'
  ];
  wishlist: string[] = [];
  currentLang: 'ar' | 'en' = 'ar';
  showCountryModal = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private languageService: LanguageService,
    private countryService: CountryService
  ) {
    this.currentLang = this.languageService.getLanguage();
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });

    // Show country modal if no country is selected
    if (!this.countryService.hasSelectedCountry()) {
      this.showCountryModal = true;
    }
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadWishlist();
    this.startSlideshow();
    this.initScrollAnimations();
  }

  initScrollAnimations(): void {
    setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
      });
    }, 100);
  }

  loadWishlist(): void {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      this.wishlist = JSON.parse(saved);
    }
  }

  toggleWishlist(event: Event, product: Product): void {
    event.stopPropagation();
    const index = this.wishlist.indexOf(product.id);
    if (index > -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(product.id);
      // Show feedback
      alert(`${product.name} added to wishlist!`);
    }
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  isInWishlist(productId: string): boolean {
    return this.wishlist.includes(productId);
  }

  startSlideshow(): void {
    interval(5000).subscribe(() => {
      this.nextSlide();
    });
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.backgroundImages.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.backgroundImages.length) % this.backgroundImages.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
      this.loading = false;
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadCartCount(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cartItemCount = cart.items.length;
    });
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.productService.searchProducts(query).subscribe(products => {
      this.filteredProducts = products;
    });
  }

  onCategoryChange(event: Event): void {
    const category = (event.target as HTMLSelectElement).value;
    this.filterByCategory(category);
  }

  filterByCategory(category: string): void {
    this.productService.filterByCategory(category).subscribe(products => {
      this.filteredProducts = products;
    });
  }

  onPriceChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'all') {
      this.filteredProducts = this.products;
    } else if (value === '500+') {
      this.productService.filterByPrice(500, Infinity).subscribe(products => {
        this.filteredProducts = products;
      });
    } else {
      const [min, max] = value.split('-').map(Number);
      this.productService.filterByPrice(min, max).subscribe(products => {
        this.filteredProducts = products;
      });
    }
  }

  goToProduct(id: string): void {
    this.router.navigate(['/product', id]);
  }

  addToCart(product: Product): void {
    const price = this.productService.getPriceByCountry(product);
    this.cartService.addToCart(product, price);
    alert(`${this.translate('home.addedToCart')}: ${product.name}`);
  }

  getPrice(product: Product): number {
    return this.productService.getPriceByCountry(product);
  }

  translateCategory(category: string): string {
    return this.languageService.translate(`category.${category.toLowerCase()}`);
  }

  translate(key: string): string {
    return this.languageService.translate(key);
  }
}
