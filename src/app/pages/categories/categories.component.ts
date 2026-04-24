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
          <div class="relative min-h-screen">
            <!-- Background - Changed to a more noticeable gradient -->
            <div class="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scroll-reveal">
              @for (category of categoryData; track category.name) {
                <div
                  class="relative bg-white rounded-3xl shadow-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-3 border-2 border-indigo-100 hover:border-indigo-300"
                  (click)="goToCategory(category.name)"
                >
                  <img
                    [src]="category.image"
                    [alt]="category.name"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  <!-- Gradient Overlay -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                  
                  <!-- Content -->
                  <div class="absolute inset-0 flex flex-col justify-end p-8">
                    <div class="transform transition-all duration-500 group-hover:translate-y-[-8px]">
                      <h2 class="text-4xl font-bold text-white mb-3 tracking-tight">
                        {{ category.name }}
                      </h2>
                      <p class="text-gray-200 text-lg mb-6 leading-relaxed">
                        {{ category.description }}
                      </p>
                      <button class="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl shadow-2xl hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:scale-105 group-hover:translate-x-2">
                        Shop Now
                        <svg class="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Shine Effect -->
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                </div>
              }
            </div>
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

  loadCategories(): void {
    this.categoryData = [
      {
        name: 'Electronics',
        description: 'Latest gadgets and tech',
        image: '/categories/electronics.jpg'
      },
      {
        name: 'Clothing',
        description: 'Premium fashion and apparel',
        image: '/categories/clothing.jpg'
      },
      {
        name: 'Accessories',
        description: 'Stylish accessories and essentials',
        image: '/categories/accessories.jpg'
      }
    ];
    this.loading = false;
  }

  goToCategory(category: string): void {
    this.router.navigate(['/products'], { queryParams: { category } });
  }
}
