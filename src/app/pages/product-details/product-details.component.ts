import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { FooterComponent } from '../../components/layout/footer.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-900 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <button
              routerLink="/"
              class="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              ← Back to Store
            </button>
            <div class="flex items-center gap-4">
              <button
                routerLink="/admin"
                class="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Admin
              </button>
              <button
                routerLink="/cart"
                class="relative p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                @if (cartItemCount > 0) {
                  <span
                    class="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {{ cartItemCount }}
                  </span>
                }
              </button>
            </div>
          </div>
        </div>
      </header>

      @if (loading) {
        <div class="flex items-center justify-center py-20">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
        </div>
      }

      @if (!loading && product) {
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <!-- Product Image -->
          <div class="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
            <img
              [src]="product.image"
              [alt]="product.name"
              class="w-full h-96 object-cover"
            />
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <div>
              <span class="text-sm text-gray-500 dark:text-gray-400 uppercase">{{ product.category }}</span>
              <h1 class="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{{ product.name }}</h1>
            </div>

            <p class="text-4xl font-bold text-gray-900 dark:text-white">\${{ product.price.toFixed(2) }}</p>

            <p class="text-gray-600 dark:text-gray-400 text-lg">{{ product.description }}</p>

            <div class="flex items-center gap-2">
              <span class="text-gray-600 dark:text-gray-400">Stock:</span>
              <span [class]="'font-medium ' + (product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')">
                {{ product.stock > 0 ? product.stock + ' available' : 'Out of stock' }}
              </span>
            </div>

            <div class="flex items-center gap-4">
              <label class="text-gray-700 dark:text-gray-300">Quantity:</label>
              <div class="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                <button
                  (click)="decrementQuantity()"
                  [disabled]="quantity <= 1"
                  class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 text-gray-900 dark:text-white"
                >
                  -
                </button>
                <span class="px-4 py-2 min-w-[60px] text-center text-gray-900 dark:text-white">{{ quantity }}</span>
                <button
                  (click)="incrementQuantity()"
                  [disabled]="quantity >= product.stock"
                  class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 text-gray-900 dark:text-white"
                >
                  +
                </button>
              </div>
            </div>

            <button
              (click)="addToCart()"
              [disabled]="product.stock === 0"
              class="w-full bg-black dark:bg-white text-white dark:text-gray-900 py-4 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
            </button>

            <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 class="font-semibold mb-3 text-gray-900 dark:text-white">Product Details</h3>
              <ul class="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Category: {{ product.category }}</li>
                <li>• Stock: {{ product.stock }} units</li>
                <li>• Added: {{ product.createdAt | date:'medium' }}</li>
              </ul>
            </div>
          </div>
        </div>
        </div>
      }

      @if (!loading && !product) {
        <div class="text-center py-20">
        <p class="text-gray-500 dark:text-gray-400 text-lg">Product not found</p>
        <button
          routerLink="/"
          class="mt-4 text-black dark:text-white hover:underline"
        >
          Return to Store
        </button>
      </div>
      }

      <app-footer></app-footer>
    </div>
  `
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  loading = true;
  quantity = 1;
  cartItemCount = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    } else {
      this.router.navigate(['/']);
    }

    this.cartService.getCart().subscribe(cart => {
      this.cartItemCount = this.cartService.getItemCount();
    });
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe(product => {
      this.product = product;
      this.loading = false;
    });
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(this.product);
      }
      this.cartItemCount = this.cartService.getItemCount();
      alert('Added to cart!');
    }
  }
}
