import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { FooterComponent } from '../../components/layout/footer.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FooterComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-20">
            <button
              routerLink="/"
              class="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Store
            </button>
            <h1 class="text-2xl font-bold">Admin Panel</h1>
            <div class="w-24"></div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <p class="text-gray-600 text-sm">Total Products</p>
            <p class="text-3xl font-bold">{{ products.length }}</p>
          </div>
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <p class="text-gray-600 text-sm">Total Orders</p>
            <p class="text-3xl font-bold">{{ orders.length }}</p>
          </div>
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <p class="text-gray-600 text-sm">Total Revenue</p>
            <p class="text-3xl font-bold">\${{ totalRevenue.toFixed(2) }}</p>
          </div>
        </div>

        <!-- Products Section -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">Products</h2>
            <button
              (click)="openAddModal()"
              class="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:shadow-lg"
            >
              + Add Product
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4">Image</th>
                  <th class="text-left py-3 px-4">Name</th>
                  <th class="text-left py-3 px-4">Category</th>
                  <th class="text-left py-3 px-4">Price</th>
                  <th class="text-left py-3 px-4">Stock</th>
                  <th class="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (product of products; track product.id) {
                  <tr class="border-b border-gray-100">
                  <td class="py-3 px-4">
                    <img [src]="product.image" [alt]="product.name" class="w-12 h-12 object-cover rounded-lg" />
                  </td>
                  <td class="py-3 px-4 font-medium">{{ product.name }}</td>
                  <td class="py-3 px-4 text-gray-600">{{ product.category }}</td>
                  <td class="py-3 px-4">\${{ product.price.toFixed(2) }}</td>
                  <td class="py-3 px-4">{{ product.stock }}</td>
                  <td class="py-3 px-4">
                    <div class="flex gap-2">
                      <button
                        (click)="openEditModal(product)"
                        class="px-3 py-1 text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      >
                        Edit
                      </button>
                      <button
                        (click)="deleteProduct(product.id)"
                        class="px-3 py-1 text-red-600 hover:text-red-800 transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Orders Section -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold mb-6">Recent Orders</h2>
          @if (orders.length === 0) {
            <div class="text-center py-8 text-gray-500">
            No orders yet
          </div>
          }
          @if (orders.length > 0) {
            <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4">Order ID</th>
                  <th class="text-left py-3 px-4">Customer</th>
                  <th class="text-left py-3 px-4">Total</th>
                  <th class="text-left py-3 px-4">Status</th>
                  <th class="text-left py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                @for (order of orders; track order.id) {
                  <tr class="border-b border-gray-100">
                  <td class="py-3 px-4 font-medium">{{ order.id }}</td>
                  <td class="py-3 px-4">{{ order.customerName }}</td>
                  <td class="py-3 px-4">\${{ order.total.toFixed(2) }}</td>
                  <td class="py-3 px-4">
                    <span [class]="'px-2 py-1 rounded text-sm ' + getStatusClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="py-3 px-4">{{ order.createdAt | date:'short' }}</td>
                </tr>
                }
              </tbody>
            </table>
          </div>
          }
        </div>
      </div>

      <app-footer></app-footer>

      <!-- Modal -->
      @if (isModalOpen) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4">
            <h2 class="text-2xl font-bold mb-6">{{ isEditMode ? 'Edit Product' : 'Add Product' }}</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  id="product-name"
                  name="product-name"
                  [(ngModel)]="productForm.name"
                  placeholder="Product Name"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input
                  [(ngModel)]="productForm.price"
                  type="number"
                  id="product-price"
                  name="product-price"
                  placeholder="0.00"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  [(ngModel)]="productForm.description"
                  id="product-description"
                  name="product-description"
                  placeholder="Product description"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  id="product-image"
                  name="product-image"
                  [(ngModel)]="productForm.image"
                  placeholder="https://example.com/image.jpg"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  [(ngModel)]="productForm.category"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                <input
                  [(ngModel)]="productForm.stock"
                  type="number"
                  id="product-stock"
                  name="product-stock"
                  placeholder="0"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div class="flex gap-3 mt-6">
              <button
                (click)="closeModal()"
                class="flex-1 px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                (click)="saveProduct()"
                class="flex-1 px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors font-medium"
              >
                {{ isEditMode ? 'Update' : 'Add' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  orders: any[] = [];
  isModalOpen = false;
  isEditMode = false;
  editingProductId: string | null = null;
  productForm = {
    name: '',
    price: '0',
    description: '',
    image: '',
    category: '',
    stock: '0'
  };

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadOrders();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  loadOrders(): void {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      this.orders = JSON.parse(savedOrders);
    }
  }

  get totalRevenue(): number {
    return this.orders.reduce((sum, order) => sum + order.total, 0);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingProductId = null;
    this.productForm = {
      name: '',
      price: '0',
      description: '',
      image: '',
      category: '',
      stock: '0'
    };
    this.isModalOpen = true;
  }

  openEditModal(product: Product): void {
    this.isEditMode = true;
    this.editingProductId = product.id;
    this.productForm = {
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      image: product.image,
      category: product.category,
      stock: product.stock.toString()
    };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveProduct(): void {
    if (!this.productForm.name || !this.productForm.price || !this.productForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    const productData = {
      ...this.productForm,
      price: parseFloat(this.productForm.price),
      stock: parseInt(this.productForm.stock)
    };

    if (this.isEditMode && this.editingProductId) {
      this.productService.updateProduct(this.editingProductId, productData).subscribe(() => {
        this.loadProducts();
        this.closeModal();
      });
    } else {
      this.productService.addProduct({
        ...productData,
        id: '',
        createdAt: new Date()
      } as Product).subscribe(() => {
        this.loadProducts();
        this.closeModal();
      });
    }
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
