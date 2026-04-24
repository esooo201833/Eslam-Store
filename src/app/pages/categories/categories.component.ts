import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { NavbarComponent } from '../../components/layout/navbar.component';
import { FooterComponent } from '../../components/layout/footer.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navbar -->
      <app-navbar [showAdmin]="true"></app-navbar>

      <!-- Page Header -->
      <section class="bg-gradient-to-r from-black to-gray-800 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Categories</h1>
          <p class="text-xl text-gray-300">Browse our products by category</p>
        </div>
      </section>

      <!-- Categories Grid -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        @if (loading) {
          <div class="text-center py-20">
            <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-black"></div>
          </div>
        }

        @if (!loading) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (category of categoryData; track category.name) {
              <div
                class="relative h-80 rounded-2xl overflow-hidden cursor-pointer group animate-fade-in"
                (click)="goToCategory(category.name)"
              >
                <img
                  [src]="category.image"
                  [alt]="category.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6">
                  <h2 class="text-3xl font-bold text-white mb-2">{{ category.name }}</h2>
                  <p class="text-gray-200 mb-4">{{ category.description }}</p>
                  <span class="inline-flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform">
                    Shop Now
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </span>
                </div>
              </div>
            }
          </div>
        }
      </section>

      <app-footer></app-footer>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  categoryData: any[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryData = [
      {
        name: 'Electronics',
        description: 'Cutting-edge technology and gadgets',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80'
      },
      {
        name: 'Clothing',
        description: 'Premium fashion and apparel',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80'
      },
      {
        name: 'Accessories',
        description: 'Stylish accessories and essentials',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
      }
    ];
    this.loading = false;
  }

  goToCategory(category: string): void {
    this.router.navigate(['/products'], { queryParams: { category } });
  }
}
