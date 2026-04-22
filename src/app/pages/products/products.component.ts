import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { NavbarComponent } from '../../components/layout/navbar.component';
import { FooterComponent } from '../../components/layout/footer.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navbar -->
      <app-navbar [showAdmin]="true"></app-navbar>

      <!-- Page Header -->
      <section class="bg-gradient-to-r from-black to-gray-800 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">All Products</h1>
          <p class="text-xl text-gray-300">Discover our complete collection of premium products</p>
        </div>
      </section>

      <!-- Search and Filter -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-10">
        <div class="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1 relative">
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type="text"
                id="products-search"
                name="products-search"
                placeholder="Search products..."
                (input)="onSearch($event)"
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>
            <select
              (change)="onCategoryChange($event)"
              class="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
            >
              <option value="all">All Categories</option>
              @for (category of categories; track category) {
                <option [value]="category">
                  {{ category }}
                </option>
              }
            </select>
            <select
              (change)="onSortChange($event)"
              class="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
            >
              <option value="default">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <!-- Category Pills -->
        <div class="flex flex-wrap gap-3 mb-8">
          <button
            (click)="filterByCategory('all')"
            class="px-6 py-2 rounded-full border-2 border-black bg-black text-white font-medium hover:bg-gray-800 transition-all"
          >
            All
          </button>
          @for (category of categories; track category) {
            <button
              (click)="filterByCategory(category)"
              class="px-6 py-2 rounded-full border-2 border-gray-200 text-gray-700 font-medium hover:border-black hover:text-black transition-all"
            >
              {{ category }}
            </button>
          }
        </div>

        <!-- Products Grid -->
        @if (loading) {
          <div class="text-center py-20">
            <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-black"></div>
            <p class="mt-4 text-gray-600">Loading products...</p>
          </div>
        }

        @if (!loading) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            @for (product of filteredProducts; track product.id) {
              <div class="product-card bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer" (click)="goToProduct(product.id)">
                <div class="relative overflow-hidden">
                  <img
                    [src]="product.image"
                    [alt]="product.name"
                    class="w-full h-64 object-cover"
                  />
                  <div class="absolute top-4 left-4">
                    <span class="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full">
                      {{ product.category }}
                    </span>
                  </div>
                  <button
                    (click)="toggleWishlist($event, product)"
                    class="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  >
                    <svg class="w-5 h-5" [class.text-red-500]="isInWishlist(product.id)" [class.text-gray-400]="!isInWishlist(product.id)" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      (click)="addToCart($event, product)"
                      class="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="text-lg font-semibold mb-2 line-clamp-1">{{ product.name }}</h3>
                  <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ product.description }}</p>
                  <div class="flex items-center justify-between">
                    <span class="text-2xl font-bold text-black">\${{ product.price.toFixed(2) }}</span>
                    <button
                      (click)="addToCart($event, product)"
                      class="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
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
        }

        @if (!loading && filteredProducts.length === 0) {
          <div class="text-center py-20">
            <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-gray-500 text-lg mb-4">No products found</p>
            <button
              (click)="filterByCategory('all')"
              class="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              View All Products
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

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadWishlist();
    this.loadCartCount();
    this.checkWishlistFilter();
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
    this.cartService.addToCart(product);
    this.loadCartCount();
  }

  toggleWishlist(event: Event, product: Product): void {
    event.stopPropagation();
    const index = this.wishlist.indexOf(product.id);
    if (index > -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(product.id);
    }
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  isInWishlist(productId: string): boolean {
    return this.wishlist.includes(productId);
  }
}
