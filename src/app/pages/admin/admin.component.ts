import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { FooterComponent } from '../../components/layout/footer.component';

interface SiteSettings {
  siteName: string;
  siteLogo: string;
  promoText: string;
  promoLink: string;
  promoImage: string;
  homeBackground: string;
  categoryBackground: string;
  [key: string]: string;
}

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
            <button
              (click)="logout()"
              class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Tabs Navigation -->
        <div class="bg-white rounded-2xl shadow-lg p-2 mb-8 flex flex-wrap gap-2">
          <button
            (click)="activeTab = 'dashboard'"
            [class.bg-gray-900]="activeTab === 'dashboard'"
            [class.text-white]="activeTab === 'dashboard'"
            [class.text-gray-700]="activeTab !== 'dashboard'"
            [class.hover:bg-gray-100]="activeTab !== 'dashboard'"
            class="flex-1 px-6 py-3 rounded-xl font-medium transition-all"
          >
            Dashboard
          </button>
          @if (isSuperAdmin) {
            <button
              (click)="activeTab = 'employees'"
              [class.bg-gray-900]="activeTab === 'employees'"
              [class.text-white]="activeTab === 'employees'"
              [class.text-gray-700]="activeTab !== 'employees'"
              [class.hover:bg-gray-100]="activeTab !== 'employees'"
              class="flex-1 px-6 py-3 rounded-xl font-medium transition-all"
            >
              Employees
            </button>
          }
          <button
            (click)="activeTab = 'site'"
            [class.bg-gray-900]="activeTab === 'site'"
            [class.text-white]="activeTab === 'site'"
            [class.text-gray-700]="activeTab !== 'site'"
            [class.hover:bg-gray-100]="activeTab !== 'site'"
            class="flex-1 px-6 py-3 rounded-xl font-medium transition-all"
          >
            Site Management
          </button>
          <button
            (click)="activeTab = 'products'"
            [class.bg-gray-900]="activeTab === 'products'"
            [class.text-white]="activeTab === 'products'"
            [class.text-gray-700]="activeTab !== 'products'"
            [class.hover:bg-gray-100]="activeTab !== 'products'"
            class="flex-1 px-6 py-3 rounded-xl font-medium transition-all"
          >
            Products & Categories
          </button>
          @if (isSuperAdmin) {
            <button
              (click)="activeTab = 'accounts'"
              [class.bg-gray-900]="activeTab === 'accounts'"
              [class.text-white]="activeTab === 'accounts'"
              [class.text-gray-700]="activeTab !== 'accounts'"
              [class.hover:bg-gray-100]="activeTab !== 'accounts'"
              class="flex-1 px-6 py-3 rounded-xl font-medium transition-all"
            >
              Accounts
            </button>
          }
        </div>

        <!-- Dashboard Tab -->
        @if (activeTab === 'dashboard') {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:shadow-xl">
              <p class="text-gray-600 text-sm">Total Products</p>
              <p class="text-3xl font-bold">{{ products.length }}</p>
            </div>
            <div class="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:shadow-xl">
              <p class="text-gray-600 text-sm">Total Orders</p>
              <p class="text-3xl font-bold">{{ orders.length }}</p>
            </div>
            <div class="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:shadow-xl">
              <p class="text-gray-600 text-sm">Total Revenue</p>
              <p class="text-3xl font-bold">\${{ totalRevenue.toFixed(2) }}</p>
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
        }

        <!-- Employees Tab -->
        @if (activeTab === 'employees') {
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold">Employees Management</h2>
              <button
                (click)="openEmployeeModal()"
                class="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:shadow-lg"
              >
                + Add Employee
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-3 px-4">Name</th>
                    <th class="text-left py-3 px-4">Email</th>
                    <th class="text-left py-3 px-4">Role</th>
                    <th class="text-left py-3 px-4">Permissions</th>
                    <th class="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (employee of employees; track employee.id) {
                    <tr class="border-b border-gray-100">
                      <td class="py-3 px-4 font-medium">{{ employee.name }}</td>
                      <td class="py-3 px-4">{{ employee.email }}</td>
                      <td class="py-3 px-4">
                        <span class="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                          {{ employee.role }}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-sm text-gray-600">
                        {{ employee.permissions.join(', ') }}
                      </td>
                      <td class="py-3 px-4">
                        <div class="flex gap-2">
                          <button
                            (click)="editEmployee(employee)"
                            class="px-3 py-1 text-blue-600 hover:text-blue-800 transition-colors font-medium"
                          >
                            Edit
                          </button>
                          <button
                            (click)="deleteEmployee(employee.id)"
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
        }

        <!-- Site Management Tab -->
        @if (activeTab === 'site') {
          <div class="space-y-6">
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold mb-6">Site Information</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Site Name</label>
                  <input
                    type="text"
                    [(ngModel)]="siteSettings.siteName"
                    placeholder="Enter site name"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Site Logo</label>
                  <div class="space-y-3">
                    <input
                      type="file"
                      (change)="onFileSelected($event, 'siteLogo')"
                      accept="image/*"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    <input
                      type="text"
                      [(ngModel)]="siteSettings.siteLogo"
                      placeholder="Or enter logo URL"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                    @if (siteSettings.siteLogo) {
                      <img [src]="siteSettings.siteLogo" class="w-32 h-32 object-contain rounded-xl border-2 border-gray-200" />
                    }
                  </div>
                </div>
                <button
                  (click)="saveSiteSettings()"
                  class="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold mb-6">Promo Banner</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Banner Text</label>
                  <input
                    type="text"
                    [(ngModel)]="siteSettings.promoText"
                    placeholder="Enter promo text"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Banner Link</label>
                  <input
                    type="text"
                    [(ngModel)]="siteSettings.promoLink"
                    placeholder="Enter promo link"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Banner Image</label>
                  <div class="space-y-3">
                    <input
                      type="file"
                      (change)="onFileSelected($event, 'promoImage')"
                      accept="image/*"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    <input
                      type="text"
                      [(ngModel)]="siteSettings.promoImage"
                      placeholder="Or enter image URL"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                    @if (siteSettings.promoImage) {
                      <img [src]="siteSettings.promoImage" class="w-full h-48 object-cover rounded-xl border-2 border-gray-200" />
                    }
                  </div>
                </div>
                <button
                  (click)="saveSiteSettings()"
                  class="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold mb-6">Background Images</h2>
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Home Background Image</label>
                  <div class="space-y-3">
                    <input
                      type="file"
                      (change)="onFileSelected($event, 'homeBackground')"
                      accept="image/*"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    <input
                      type="text"
                      [(ngModel)]="siteSettings.homeBackground"
                      placeholder="Or enter image URL"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                    @if (siteSettings.homeBackground) {
                      <img [src]="siteSettings.homeBackground" class="w-full h-48 object-cover rounded-xl border-2 border-gray-200" />
                    }
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Category Background Image</label>
                  <div class="space-y-3">
                    <input
                      type="file"
                      (change)="onFileSelected($event, 'categoryBackground')"
                      accept="image/*"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    <input
                      type="text"
                      [(ngModel)]="siteSettings.categoryBackground"
                      placeholder="Or enter image URL"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                    @if (siteSettings.categoryBackground) {
                      <img [src]="siteSettings.categoryBackground" class="w-full h-48 object-cover rounded-xl border-2 border-gray-200" />
                    }
                  </div>
                </div>
                <button
                  (click)="saveSiteSettings()"
                  class="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        }

        <!-- Products & Categories Tab -->
        @if (activeTab === 'products') {
          <div class="space-y-6">
            <!-- Categories Section -->
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold">Categories</h2>
                <button
                  (click)="openCategoryModal()"
                  class="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:shadow-lg"
                >
                  + Add Category
                </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                @for (category of categories; track category) {
                  <div class="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                    <span class="font-medium">{{ category }}</span>
                    <button
                      (click)="deleteCategory(category)"
                      class="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                }
              </div>
            </div>

            <!-- Products Section -->
            <div class="bg-white rounded-2xl shadow-lg p-6">
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
          </div>
        }

        <!-- Accounts Tab (Super Admin Only) -->
        @if (activeTab === 'accounts' && isSuperAdmin) {
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold mb-6">Admin Accounts</h2>
            <div class="space-y-4">
              <div class="border border-gray-200 rounded-xl p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-bold">Super Admin</p>
                    <p class="text-gray-600 text-sm">admin@admin.com</p>
                  </div>
                  <span class="px-2 py-1 rounded text-sm bg-red-100 text-red-800">Full Access</span>
                </div>
              </div>
              <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p class="text-yellow-800 text-sm">
                  ⚠️ Only the super admin can access this section. Be careful when managing admin accounts.
                </p>
              </div>
            </div>
          </div>
        }
      </div>

      <app-footer></app-footer>

      <!-- Product Modal -->
      @if (isModalOpen) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-bold mb-6">{{ isEditMode ? 'Edit Product' : 'Add Product' }}</h2>
            <div class="space-y-5">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  id="product-name"
                  name="product-name"
                  [(ngModel)]="productForm.name"
                  placeholder="Product Name"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Price</label>
                <input
                  [(ngModel)]="productForm.price"
                  type="number"
                  id="product-price"
                  name="product-price"
                  placeholder="0.00"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  [(ngModel)]="productForm.description"
                  id="product-description"
                  name="product-description"
                  placeholder="Product description"
                  rows="4"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Image</label>
                <div class="space-y-3">
                  <input
                    type="file"
                    (change)="onProductFileSelected($event)"
                    accept="image/*"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  />
                  <input
                    type="text"
                    id="product-image"
                    name="product-image"
                    [(ngModel)]="productForm.image"
                    placeholder="Or enter image URL"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                  @if (productForm.image) {
                    <img [src]="productForm.image" class="w-full h-48 object-cover rounded-xl border-2 border-gray-200" />
                  }
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select
                  id="product-category"
                  name="product-category"
                  [(ngModel)]="productForm.category"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select category</option>
                  @for (category of categories; track category) {
                    <option [value]="category">{{ category }}</option>
                  }
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Stock</label>
                <input
                  [(ngModel)]="productForm.stock"
                  type="number"
                  id="product-stock"
                  name="product-stock"
                  placeholder="0"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div class="flex gap-3 mt-8">
              <button
                (click)="closeModal()"
                class="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-100 transition-colors font-medium"
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

      <!-- Employee Modal -->
      @if (isEmployeeModalOpen) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4">
            <h2 class="text-2xl font-bold mb-6">{{ isEditEmployee ? 'Edit Employee' : 'Add Employee' }}</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  [(ngModel)]="employeeForm.name"
                  placeholder="Employee Name"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  [(ngModel)]="employeeForm.email"
                  placeholder="employee@example.com"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  [(ngModel)]="employeeForm.password"
                  placeholder="Password"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  [(ngModel)]="employeeForm.role"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                >
                  <option value="manager">Manager</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div class="space-y-2">
                  <label class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="employeeForm.permissions.products" class="w-4 h-4" />
                    <span>Manage Products</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="employeeForm.permissions.categories" class="w-4 h-4" />
                    <span>Manage Categories</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="employeeForm.permissions.orders" class="w-4 h-4" />
                    <span>Manage Orders</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="employeeForm.permissions.site" class="w-4 h-4" />
                    <span>Manage Site Settings</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="flex gap-3 mt-6">
              <button
                (click)="closeEmployeeModal()"
                class="flex-1 px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                (click)="saveEmployee()"
                class="flex-1 px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors font-medium"
              >
                {{ isEditEmployee ? 'Update' : 'Add' }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Category Modal -->
      @if (isCategoryModalOpen) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold mb-6">Add Category</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  [(ngModel)]="newCategory"
                  placeholder="Category Name"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div class="flex gap-3 mt-6">
              <button
                (click)="closeCategoryModal()"
                class="flex-1 px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                (click)="saveCategory()"
                class="flex-1 px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors font-medium"
              >
                Add
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

  // Tab management
  activeTab = 'dashboard';

  // Employee management
  employees: any[] = [];
  isEmployeeModalOpen = false;
  isEditEmployee = false;
  editingEmployeeId: string | null = null;
  employeeForm = {
    name: '',
    email: '',
    password: '',
    role: 'manager',
    permissions: {
      products: false,
      categories: false,
      orders: false,
      site: false
    }
  };

  // Site management
  siteSettings: SiteSettings = {
    siteName: 'Eslam Store',
    siteLogo: '',
    promoText: '',
    promoLink: '',
    promoImage: '',
    homeBackground: '',
    categoryBackground: ''
  };

  // Category management
  categories: string[] = [];
  isCategoryModalOpen = false;
  newCategory = '';

  // Permissions
  isSuperAdmin = false;
  currentAdminEmail = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAdminAccess();
    this.loadProducts();
    this.loadOrders();
    this.loadEmployees();
    this.loadCategories();
    this.loadSiteSettings();
  }

  checkAdminAccess(): void {
    const isAdmin = localStorage.getItem('isAdmin');
    const adminEmail = localStorage.getItem('adminEmail');
    
    console.log('Admin Access Check:', { isAdmin, adminEmail });
    
    if (!isAdmin || isAdmin !== 'true') {
      this.router.navigate(['/']);
      return;
    }

    this.currentAdminEmail = adminEmail || '';
    this.isSuperAdmin = this.currentAdminEmail === 'admin@admin.com';
    
    console.log('Super Admin Status:', this.isSuperAdmin);
  }

  logout(): void {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    this.router.navigate(['/']);
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

  loadEmployees(): void {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      this.employees = JSON.parse(savedEmployees);
    }
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadSiteSettings(): void {
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      this.siteSettings = JSON.parse(savedSettings);
    }
  }

  saveSiteSettings(): void {
    localStorage.setItem('siteSettings', JSON.stringify(this.siteSettings));
    alert('Site settings saved successfully!');
  }

  // File upload methods
  onFileSelected(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        (this.siteSettings as any)[field] = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onProductFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.productForm.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Employee management methods
  openEmployeeModal(): void {
    this.isEditEmployee = false;
    this.editingEmployeeId = null;
    this.employeeForm = {
      name: '',
      email: '',
      password: '',
      role: 'manager',
      permissions: {
        products: false,
        categories: false,
        orders: false,
        site: false
      }
    };
    this.isEmployeeModalOpen = true;
  }

  closeEmployeeModal(): void {
    this.isEmployeeModalOpen = false;
  }

  editEmployee(employee: any): void {
    this.isEditEmployee = true;
    this.editingEmployeeId = employee.id;
    this.employeeForm = {
      name: employee.name,
      email: employee.email,
      password: employee.password,
      role: employee.role,
      permissions: employee.permissions
    };
    this.isEmployeeModalOpen = true;
  }

  saveEmployee(): void {
    if (!this.employeeForm.name || !this.employeeForm.email || !this.employeeForm.password) {
      alert('Please fill in all required fields');
      return;
    }

    const employeeData = {
      ...this.employeeForm,
      id: this.isEditEmployee ? this.editingEmployeeId : Date.now().toString()
    };

    if (this.isEditEmployee) {
      const index = this.employees.findIndex(e => e.id === this.editingEmployeeId);
      if (index > -1) {
        this.employees[index] = employeeData;
      }
    } else {
      this.employees.push(employeeData);
    }

    localStorage.setItem('employees', JSON.stringify(this.employees));
    this.closeEmployeeModal();
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employees = this.employees.filter(e => e.id !== id);
      localStorage.setItem('employees', JSON.stringify(this.employees));
    }
  }

  // Category management methods
  openCategoryModal(): void {
    this.newCategory = '';
    this.isCategoryModalOpen = true;
  }

  closeCategoryModal(): void {
    this.isCategoryModalOpen = false;
  }

  saveCategory(): void {
    if (!this.newCategory) {
      alert('Please enter a category name');
      return;
    }

    if (!this.categories.includes(this.newCategory)) {
      this.categories.push(this.newCategory);
      localStorage.setItem('categories', JSON.stringify(this.categories));
    }

    this.closeCategoryModal();
  }

  deleteCategory(category: string): void {
    if (confirm(`Are you sure you want to delete the category "${category}"?`)) {
      this.categories = this.categories.filter(c => c !== category);
      localStorage.setItem('categories', JSON.stringify(this.categories));
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
