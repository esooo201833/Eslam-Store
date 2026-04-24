import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { NavbarComponent } from '../../components/layout/navbar.component';
import { FooterComponent } from '../../components/layout/footer.component';
import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
      <!-- Navbar -->
      <app-navbar [showAdmin]="true"></app-navbar>

      <!-- Page Header -->
      <section class="bg-gradient-to-r from-black to-gray-800 dark:from-gray-900 dark:to-gray-700 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ translate('products.title') }}</h1>
          <p class="text-xl text-gray-300">{{ translate('products.subtitle') }}</p>
        </div>
      </section>

      <!-- Search and Filter -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-10">
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 mb-8">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1 relative">
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type="text"
                id="products-search"
                name="products-search"
                placeholder="{{ translate('home.searchPlaceholder') }}"
                (input)="onSearch($event)"
                class="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
              />
            </div>
            <select
              id="products-category"
              name="products-category"
              (change)="onCategoryChange($event)"
              class="px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
            >
              <option value="all">{{ translate('home.allCategories') }}</option>
              @for (category of categories; track category) {
                <option [value]="category">
                  {{ translateCategory(category) }}
                </option>
              }
            </select>
            <select
              id="products-sort"
              name="products-sort"
              (change)="onSortChange($event)"
              class="px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
            >
              <option value="default">{{ translate('products.sortBy') }}</option>
              <option value="price-low">{{ translate('products.priceLow') }}</option>
              <option value="price-high">{{ translate('products.priceHigh') }}</option>
              <option value="name">{{ translate('products.name') }}</option>
            </select>
          </div>
        </div>

        <!-- Category Pills -->
        <div class="flex flex-wrap gap-3 mb-8">
          <button
            (click)="filterByCategory('all')"
            class="px-6 py-2 rounded-full border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
          >
            {{ translate('home.all') }}
          </button>
          @for (category of categories; track category) {
            <button
              (click)="filterByCategory(category)"
              class="px-6 py-2 rounded-full border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all"
            >
              {{ translateCategory(category) }}
            </button>
          }
        </div>

        <!-- Products Grid -->
        @if (loading) {
          <div class="text-center py-20">
            <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-black dark:border-white"></div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">{{ translate('home.loading') }}</p>
          </div>
        }

        @if (!loading) {
          <div class="relative min-h-screen">
            <!-- Background - Changed to a more noticeable gradient -->
            <div class="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 scroll-reveal">
              @for (product of filteredProducts; track product.id) {
                <div
                  class="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-3 border-2 border-indigo-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-gray-600"
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
                      <span class="px-4 py-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md text-xs font-bold text-gray-800 dark:text-gray-200 rounded-full shadow-lg uppercase tracking-wider">
                        {{ translateCategory(product.category) }}
                      </span>
                    </div>

                    <!-- Wishlist Button -->
                    <button
                      (click)="toggleWishlist($event, product)"
                      class="absolute top-4 right-4 p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white dark:hover:bg-gray-700 z-20"
                      [class.bg-red-50]="isInWishlist(product.id)"
                      [class.bg-white/95]="!isInWishlist(product.id)"
                    >
                      <svg class="w-5 h-5 transition-colors duration-300" [class.text-red-500]="isInWishlist(product.id)" [class.text-gray-400]="!isInWishlist(product.id)" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Content -->
                  <div class="p-6">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-black dark:group-hover:text-gray-200 transition-colors">
                      {{ product.name }}
                    </h3>
                    <p class="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {{ product.description }}
                    </p>
                    <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div class="flex flex-col">
                        <span class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">{{ translate('home.price') }}</span>
                        <span class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                          $ {{ getPrice(product).toFixed(2) }}
                        </span>
                      </div>
                      <button
                        (click)="addToCart($event, product)"
                        class="p-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl shadow-lg hover:bg-black dark:hover:bg-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
    </div>
  `,
  styles: [`
    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  loading = true;
  cartItemCount = 0;
  wishlist: string[] = [];
  currentLang: 'ar' | 'en' = 'ar';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private languageService: LanguageService,
    private apiService: ApiService
  ) {
    this.currentLang = this.languageService.getLanguage();
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadWishlist();
    this.loadCartCount();
    this.checkWishlistFilter();
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

  checkWishlistFilter(): void {
    const params = new URLSearchParams(window.location.search);
    if (params.get('wishlist') === 'true') {
      this.filterByWishlist();
    }
  }

  filterByWishlist(): void {
    this.filteredProducts = this.products.filter(product => this.wishlist.includes(product.id));
  }

  loadProducts(): void {
    // Try to load from backend first
    if (localStorage.getItem('token')) {
      this.apiService.getProducts().subscribe({
        next: (response) => {
          this.products = response.products;
          this.filteredProducts = response.products;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading products from backend:', error);
          // Fallback to local product service
          this.productService.getProducts().subscribe(products => {
            this.products = products;
            this.filteredProducts = products;
            this.loading = false;
          });
        }
      });
    } else {
      // Use local product service if not logged in
      this.productService.getProducts().subscribe(products => {
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
      });
    }
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadWishlist(): void {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      this.wishlist = JSON.parse(saved);
    }
  }

  loadCartCount(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cartItemCount = cart.items.length;
    });
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  }

  onCategoryChange(event: Event): void {
    const category = (event.target as HTMLSelectElement).value;
    this.filterByCategory(category);
  }

  filterByCategory(category: string): void {
    if (category === 'all') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product => product.category === category);
    }
  }

  onSortChange(event: Event): void {
    const sort = (event.target as HTMLSelectElement).value;
    switch (sort) {
      case 'price-low':
        this.filteredProducts = [...this.filteredProducts].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredProducts = [...this.filteredProducts].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        this.filteredProducts = [...this.filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        this.filteredProducts = this.products;
    }
  }

  goToProduct(id: string): void {
    this.router.navigate(['/product', id]);
  }

  addToCart(event: Event, product: Product): void {
    event.stopPropagation();
    const price = this.getPrice(product);
    this.cartService.addToCart(product, price);
    this.loadCartCount();
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

  translate(key: string): string {
    return this.languageService.translate(key);
  }

  translateCategory(category: string): string {
    return this.languageService.translate(`category.${category.toLowerCase()}`);
  }

  getPrice(product: Product): number {
    return this.productService.getPriceByCountry(product);
  }
}
