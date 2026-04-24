import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { FooterComponent } from '../../components/layout/footer.component';
import { LanguageService } from '../../services/language.service';
import { ShippingService } from '../../services/shipping.service';
import { ShippingCompany } from '../../models/shipping.model';

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
              {{ translate('admin.back') }}
            </button>
            <h1 class="text-2xl font-bold">Admin Panel</h1>
            <div class="flex items-center gap-3">
              <button
                (click)="toggleLanguage()"
                class="p-3 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition-all duration-300 transform hover:scale-110"
                title="Change Language"
              >
                <span class="font-bold text-lg">{{ currentLang === 'ar' ? 'EN' : 'ع' }}</span>
              </button>
              <button
                (click)="logout()"
                class="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all hover:shadow-lg"
              >
                {{ translate('admin.logout') }}
              </button>
            </div>
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
            {{ translate('admin.dashboard') }}
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
              {{ translate('admin.employees') }}
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
            {{ translate('admin.site') }}
          </button>
          @if (isSuperAdmin || hasShippingPermission) {
            <button
              (click)="activeTab = 'shipping'"
              [class.bg-gray-900]="activeTab === 'shipping'"
              [class.text-white]="activeTab === 'shipping'"
              [class.text-gray-700]="activeTab !== 'shipping'"
              [class.hover:bg-gray-100]="activeTab !== 'shipping'"
              class="flex-1 px-6 py-3 rounded-xl font-medium transition-all"
            >
              {{ translate('admin.shipping') }}
            </button>
          }
          <button
            (click)="activeTab = 'products'"
            [class.bg-gray-900]="activeTab === 'products'"
            [class.text-white]="activeTab === 'products'"
            [class.text-gray-700]="activeTab !== 'products'"
            [class.hover:bg-gray-100]="activeTab !== 'products'"
            class="flex-1 px-6 py-3 rounded-xl font-medium transition-all"
          >
            {{ translate('admin.products') }}
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
              {{ translate('admin.accounts') }}
            </button>
          }
        </div>

        <!-- Dashboard Tab -->
        @if (activeTab === 'dashboard') {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:shadow-xl">
              <p class="text-gray-600 text-sm">{{ translate('admin.totalProducts') }}</p>
              <p class="text-3xl font-bold">{{ products.length }}</p>
            </div>
            <div class="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:shadow-xl">
              <p class="text-gray-600 text-sm">{{ translate('admin.totalOrders') }}</p>
              <p class="text-3xl font-bold">{{ orders.length }}</p>
            </div>
            <div class="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:shadow-xl">
              <p class="text-gray-600 text-sm">{{ translate('admin.totalRevenue') }}</p>
              <p class="text-3xl font-bold">$ {{ totalRevenue.toFixed(2) }}</p>
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
              <h2 class="text-xl font-bold">{{ translate('admin.employeesTitle') }}</h2>
              <button
                (click)="openEmployeeModal()"
                class="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:shadow-lg"
              >
                + {{ translate('admin.addEmployee') }}
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-3 px-4">{{ translate('admin.name') }}</th>
                    <th class="text-left py-3 px-4">{{ translate('admin.email') }}</th>
                    <th class="text-left py-3 px-4">{{ translate('admin.role') }}</th>
                    <th class="text-left py-3 px-4">{{ translate('admin.permissions') }}</th>
                    <th class="text-left py-3 px-4">{{ translate('admin.actions') }}</th>
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
                            {{ translate('admin.edit') }}
                          </button>
                          <button
                            (click)="deleteEmployee(employee.id)"
                            class="px-3 py-1 text-red-600 hover:text-red-800 transition-colors font-medium"
                          >
                            {{ translate('admin.delete') }}
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
              <h2 class="text-xl font-bold mb-6">{{ translate('admin.siteInfo') }}</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.siteName') }}</label>
                  <input
                    type="text"
                    [(ngModel)]="siteSettings.siteName"
                    placeholder="{{ translate('general.enter') }} {{ translate('admin.siteName') }}"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.siteLogo') }}</label>
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
                      placeholder="{{ translate('general.orEnterUrl') }}"
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
                  {{ translate('admin.saveChanges') }}
                </button>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold mb-6">{{ translate('admin.promoBanner') }}</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.bannerText') }}</label>
                  <input
                    type="text"
                    [(ngModel)]="siteSettings.promoText"
                    placeholder="{{ translate('general.enter') }} {{ translate('admin.bannerText') }}"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.bannerLink') }}</label>
                  <input
                    type="text"
                    [(ngModel)]="siteSettings.promoLink"
                    placeholder="{{ translate('general.enter') }} {{ translate('admin.bannerLink') }}"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.bannerImage') }}</label>
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
                      placeholder="{{ translate('general.orEnterUrl') }}"
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
                  {{ translate('admin.saveChanges') }}
                </button>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold mb-6">{{ translate('admin.backgroundImages') }}</h2>
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.homeBackground') }}</label>
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
                      placeholder="{{ translate('general.orEnterUrl') }}"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                    @if (siteSettings.homeBackground) {
                      <img [src]="siteSettings.homeBackground" class="w-full h-48 object-cover rounded-xl border-2 border-gray-200" />
                    }
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.categoryBackground') }}</label>
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
                      placeholder="{{ translate('general.orEnterUrl') }}"
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
                  {{ translate('admin.saveChanges') }}
                </button>
              </div>
            </div>
          </div>
        }

        <!-- Shipping Tab -->
        @if (activeTab === 'shipping') {
          <div class="space-y-6">
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold">{{ translate('admin.shippingCompanies') }}</h2>
                <button
                  (click)="openShippingModal()"
                  class="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:shadow-lg"
                >
                  + {{ translate('admin.addShippingCompany') }}
                </button>
              </div>
              <div class="space-y-4">
                @for (company of shippingCompanies; track company.id) {
                  <div class="border border-gray-200 rounded-xl p-6">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center gap-4">
                        @if (company.logo) {
                          <img [src]="company.logo" class="w-16 h-16 object-contain rounded-lg" />
                        }
                        <div>
                          <h3 class="font-bold text-lg">{{ company.name }}</h3>
                          <p class="text-sm text-gray-500">{{ company.countries.length }} {{ translate('admin.countries') }}</p>
                        </div>
                      </div>
                      <div class="flex gap-2">
                        <button
                          (click)="editShipping(company)"
                          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {{ translate('admin.edit') }}
                        </button>
                        <button
                          (click)="deleteShipping(company.id)"
                          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          {{ translate('admin.delete') }}
                        </button>
                      </div>
                    </div>
                    <div class="space-y-3">
                      @for (country of company.countries; track country.country) {
                        <div class="bg-gray-50 rounded-lg p-4">
                          <h4 class="font-semibold mb-2">{{ translateCountry(country.country) }} ({{ country.currency }})</h4>
                          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                            @for (governorate of country.governorates; track governorate.governorate) {
                              <div class="flex justify-between items-center bg-white rounded-lg p-2 border border-gray-200">
                                <span class="text-sm">{{ governorate.governorate }}</span>
                                <span class="font-bold text-sm">{{ governorate.price }} {{ country.currency }}</span>
                              </div>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }
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
                <h2 class="text-xl font-bold">{{ translate('admin.categoriesTitle') }}</h2>
                <button
                  (click)="openCategoryModal()"
                  class="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:shadow-lg"
                >
                  + {{ translate('admin.addCategory') }}
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
                <h2 class="text-xl font-bold">{{ translate('admin.productsTitle') }}</h2>
                <button
                  (click)="openAddModal()"
                  class="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:shadow-lg"
                >
                  + {{ translate('admin.addProduct') }}
                </button>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-gray-200">
                      <th class="text-left py-3 px-4">{{ translate('admin.image') }}</th>
                      <th class="text-left py-3 px-4">{{ translate('admin.productName') }}</th>
                      <th class="text-left py-3 px-4">{{ translate('admin.category') }}</th>
                      <th class="text-left py-3 px-4">{{ translate('admin.price') }}</th>
                      <th class="text-left py-3 px-4">{{ translate('admin.stock') }}</th>
                      <th class="text-left py-3 px-4">{{ translate('admin.actions') }}</th>
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
                        <td class="py-3 px-4">$ {{ product.price.toFixed(2) }}</td>
                        <td class="py-3 px-4">{{ product.stock }}</td>
                        <td class="py-3 px-4">
                          <div class="flex gap-2">
                            <button
                              (click)="openEditModal(product)"
                              class="px-3 py-1 text-blue-600 hover:text-blue-800 transition-colors font-medium"
                            >
                              {{ translate('admin.edit') }}
                            </button>
                            <button
                              (click)="deleteProduct(product.id)"
                              class="px-3 py-1 text-red-600 hover:text-red-800 transition-colors font-medium"
                            >
                              {{ translate('admin.delete') }}
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
            <h2 class="text-2xl font-bold mb-6">{{ isEditMode ? translate('admin.edit') + ' ' + translate('admin.productsTitle') : translate('admin.addProduct') }}</h2>
            <div class="space-y-5">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.productName') }}</label>
                <input
                  type="text"
                  id="product-name"
                  name="product-name"
                  [(ngModel)]="productForm.name"
                  placeholder="{{ translate('admin.productName') }}"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.price') }} ({{ translate('admin.defaultPrice') }})</label>
                <input
                  [(ngModel)]="productForm.price"
                  type="number"
                  id="product-price"
                  name="product-price"
                  placeholder="0.00"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>

              <!-- Prices by Country -->
              <div class="bg-gray-50 p-4 rounded-xl">
                <h3 class="font-bold text-gray-900 mb-4">{{ translate('admin.pricesByCountry') }}</h3>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">🇪🇬 {{ translate('admin.egyptPrice') }}</label>
                    <input
                      [(ngModel)]="productForm.pricesByCountry.egypt"
                      type="number"
                      id="price-egypt"
                      name="price-egypt"
                      placeholder="0.00"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">🇸🇦 {{ translate('admin.saudiPrice') }}</label>
                    <input
                      [(ngModel)]="productForm.pricesByCountry.saudi"
                      type="number"
                      id="price-saudi"
                      name="price-saudi"
                      placeholder="0.00"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">🇴🇲 {{ translate('admin.omanPrice') }}</label>
                    <input
                      [(ngModel)]="productForm.pricesByCountry.oman"
                      type="number"
                      id="price-oman"
                      name="price-oman"
                      placeholder="0.00"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.description') }}</label>
                <textarea
                  [(ngModel)]="productForm.description"
                  id="product-description"
                  name="product-description"
                  placeholder="{{ translate('admin.description') }}"
                  rows="4"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.image') }}</label>
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
                    placeholder="{{ translate('general.orEnterUrl') }}"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                  @if (productForm.image) {
                    <img [src]="productForm.image" class="w-full h-48 object-cover rounded-xl border-2 border-gray-200" />
                  }
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.category') }}</label>
                <select
                  id="product-category"
                  name="product-category"
                  [(ngModel)]="productForm.category"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                >
                  <option value="">{{ translate('general.selectCategory') }}</option>
                  @for (category of categories; track category) {
                    <option [value]="category">{{ category }}</option>
                  }
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.stock') }}</label>
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
                {{ translate('admin.cancel') }}
              </button>
              <button
                (click)="saveProduct()"
                class="flex-1 px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors font-medium"
              >
                {{ isEditMode ? translate('admin.update') : translate('admin.add') }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Employee Modal -->
      @if (isEmployeeModalOpen) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4">
            <h2 class="text-2xl font-bold mb-6">{{ isEditEmployee ? translate('admin.edit') + ' ' + translate('admin.employeesTitle') : translate('admin.addEmployee') }}</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.name') }}</label>
                <input
                  type="text"
                  [(ngModel)]="employeeForm.name"
                  placeholder="{{ translate('admin.name') }}"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.email') }}</label>
                <input
                  type="email"
                  [(ngModel)]="employeeForm.email"
                  placeholder="employee@example.com"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.password') }}</label>
                <input
                  type="password"
                  [(ngModel)]="employeeForm.password"
                  placeholder="••••••••"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.role') }}</label>
                <select
                  [(ngModel)]="employeeForm.role"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                >
                  <option value="manager">Manager</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.permissions') }}</label>
                <div class="space-y-2">
                  <label class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="employeeForm.permissions.products" class="w-4 h-4" />
                    <span>{{ translate('admin.manageProducts') }}</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="employeeForm.permissions.categories" class="w-4 h-4" />
                    <span>{{ translate('admin.manageCategories') }}</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="employeeForm.permissions.orders" class="w-4 h-4" />
                    <span>{{ translate('admin.manageOrders') }}</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="employeeForm.permissions.site" class="w-4 h-4" />
                    <span>{{ translate('admin.manageSite') }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="flex gap-3 mt-6">
              <button
                (click)="closeEmployeeModal()"
                class="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-100 transition-colors font-medium"
              >
                {{ translate('admin.cancel') }}
              </button>
              <button
                (click)="saveEmployee()"
                class="flex-1 px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors font-medium"
              >
                {{ isEditEmployee ? translate('admin.update') : translate('admin.add') }}
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

      <!-- Shipping Modal -->
      @if (isShippingModalOpen) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-2xl font-bold">
                {{ isEditShipping ? translate('admin.edit') : translate('admin.add') }} {{ translate('admin.shippingCompany') }}
              </h2>
            </div>
            <div class="p-6 space-y-6">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.shippingCompanyName') }}</label>
                <input
                  type="text"
                  [(ngModel)]="shippingForm.name"
                  placeholder="{{ translate('admin.shippingCompanyName') }}"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">{{ translate('admin.shippingCompanyLogo') }}</label>
                <input
                  type="text"
                  [(ngModel)]="shippingForm.logo"
                  placeholder="{{ translate('general.orEnterUrl') }}"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
              
              <!-- Countries Section -->
              <div class="space-y-4">
                <h3 class="text-lg font-bold">{{ translate('admin.countries') }}</h3>
                
                <!-- Egypt -->
                <div class="border border-gray-200 rounded-xl p-4">
                  <h4 class="font-semibold mb-3">{{ translateCountry('egypt') }}</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">{{ translate('admin.currency') }}</label>
                      <select
                        [(ngModel)]="egyptCurrency"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      >
                        <option value="EGP">EGP - Egyptian Pound</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                      </select>
                    </div>
                  </div>
                  <div class="mt-4 space-y-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ translate('admin.governorates') }}</label>
                    @for (gov of ['Cairo', 'Alexandria', 'Giza', 'Dakahlia', 'Sharqia']; track gov) {
                      <div class="flex gap-2 items-center">
                        <input
                          type="text"
                          [value]="gov"
                          disabled
                          class="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        />
                        <input
                          type="number"
                          [(ngModel)]="egyptPrices[gov]"
                          placeholder="Price"
                          class="w-32 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        />
                      </div>
                    }
                  </div>
                </div>

                <!-- Saudi Arabia -->
                <div class="border border-gray-200 rounded-xl p-4">
                  <h4 class="font-semibold mb-3">{{ translateCountry('saudi') }}</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">{{ translate('admin.currency') }}</label>
                      <select
                        [(ngModel)]="saudiCurrency"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      >
                        <option value="SAR">SAR - Saudi Riyal</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                      </select>
                    </div>
                  </div>
                  <div class="mt-4 space-y-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ translate('admin.governorates') }}</label>
                    @for (gov of ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina']; track gov) {
                      <div class="flex gap-2 items-center">
                        <input
                          type="text"
                          [value]="gov"
                          disabled
                          class="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        />
                        <input
                          type="number"
                          [(ngModel)]="saudiPrices[gov]"
                          placeholder="Price"
                          class="w-32 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        />
                      </div>
                    }
                  </div>
                </div>

                <!-- Oman -->
                <div class="border border-gray-200 rounded-xl p-4">
                  <h4 class="font-semibold mb-3">{{ translateCountry('oman') }}</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">{{ translate('admin.currency') }}</label>
                      <select
                        [(ngModel)]="omanCurrency"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      >
                        <option value="OMR">OMR - Omani Rial</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                      </select>
                    </div>
                  </div>
                  <div class="mt-4 space-y-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ translate('admin.governorates') }}</label>
                    @for (gov of ['Muscat', 'Seeb', 'Salalah', 'Sohar', 'Nizwa']; track gov) {
                      <div class="flex gap-2 items-center">
                        <input
                          type="text"
                          [value]="gov"
                          disabled
                          class="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        />
                        <input
                          type="number"
                          [(ngModel)]="omanPrices[gov]"
                          placeholder="Price"
                          class="w-32 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        />
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-3 p-6 border-t border-gray-200">
              <button
                (click)="closeShippingModal()"
                class="flex-1 px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors font-medium"
              >
                {{ translate('admin.cancel') }}
              </button>
              <button
                (click)="saveShipping()"
                class="flex-1 px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors font-medium"
              >
                {{ isEditShipping ? translate('admin.update') : translate('admin.add') }}
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
    pricesByCountry: {
      egypt: '',
      saudi: '',
      oman: ''
    },
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
      site: false,
      shipping: false
    }
  };

  // Shipping management
  shippingCompanies: ShippingCompany[] = [];
  isShippingModalOpen = false;
  isEditShipping = false;
  editingShippingId: string | null = null;
  shippingForm = {
    name: '',
    logo: '',
    countries: [] as any[]
  };
  
  // Temporary storage for form data
  egyptCurrency = 'EGP';
  saudiCurrency = 'SAR';
  omanCurrency = 'OMR';
  egyptPrices: { [key: string]: number } = {};
  saudiPrices: { [key: string]: number } = {};
  omanPrices: { [key: string]: number } = {};

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
  hasShippingPermission = false;
  currentAdminEmail = '';
  currentLang: 'ar' | 'en' = 'ar';

  constructor(
    private productService: ProductService,
    private router: Router,
    private languageService: LanguageService,
    private shippingService: ShippingService
  ) {
    this.currentLang = this.languageService.getLanguage();
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  ngOnInit(): void {
    this.checkAdminAccess();
    this.loadProducts();
    this.loadOrders();
    this.loadEmployees();
    this.loadCategories();
    this.loadSiteSettings();
    this.loadShippingCompanies();
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
    
    // Check shipping permission for employees
    if (!this.isSuperAdmin) {
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const currentEmployee = employees.find((e: any) => e.email === this.currentAdminEmail);
      if (currentEmployee && currentEmployee.permissions) {
        this.hasShippingPermission = currentEmployee.permissions.shipping || false;
      }
    } else {
      this.hasShippingPermission = true; // Super admin has all permissions
    }
    
    console.log('Super Admin Status:', this.isSuperAdmin);
    console.log('Shipping Permission:', this.hasShippingPermission);
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

  loadShippingCompanies(): void {
    this.shippingService.getShippingCompanies().subscribe(companies => {
      this.shippingCompanies = companies;
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

  translate(key: string): string {
    return this.languageService.translate(key);
  }

  toggleLanguage(): void {
    const newLang = this.currentLang === 'ar' ? 'en' : 'ar';
    this.languageService.setLanguage(newLang);
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
        site: false,
        shipping: false
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
    if (confirm('Are you sure you want to delete this category?')) {
      this.categories = this.categories.filter(c => c !== category);
      localStorage.setItem('categories', JSON.stringify(this.categories));
    }
  }

  // Shipping management methods
  openShippingModal(): void {
    this.isEditShipping = false;
    this.editingShippingId = null;
    this.shippingForm = {
      name: '',
      logo: '',
      countries: []
    };
    
    // Reset temporary variables
    this.egyptCurrency = 'EGP';
    this.saudiCurrency = 'SAR';
    this.omanCurrency = 'OMR';
    this.egyptPrices = {};
    this.saudiPrices = {};
    this.omanPrices = {};
    
    this.isShippingModalOpen = true;
  }

  closeShippingModal(): void {
    this.isShippingModalOpen = false;
  }

  editShipping(company: ShippingCompany): void {
    this.isEditShipping = true;
    this.editingShippingId = company.id;
    this.shippingForm = {
      name: company.name,
      logo: company.logo || '',
      countries: JSON.parse(JSON.stringify(company.countries))
    };
    
    // Populate temporary variables
    if (company.countries[0]) {
      this.egyptCurrency = company.countries[0].currency;
      this.egyptPrices = {};
      company.countries[0].governorates.forEach(g => {
        this.egyptPrices[g.governorate] = g.price;
      });
    }
    
    if (company.countries[1]) {
      this.saudiCurrency = company.countries[1].currency;
      this.saudiPrices = {};
      company.countries[1].governorates.forEach(g => {
        this.saudiPrices[g.governorate] = g.price;
      });
    }
    
    if (company.countries[2]) {
      this.omanCurrency = company.countries[2].currency;
      this.omanPrices = {};
      company.countries[2].governorates.forEach(g => {
        this.omanPrices[g.governorate] = g.price;
      });
    }
    
    this.isShippingModalOpen = true;
  }

  saveShipping(): void {
    if (!this.shippingForm.name) {
      alert('Please enter company name');
      return;
    }

    // Build countries array from temporary variables
    const egyptGovernorates = ['Cairo', 'Alexandria', 'Giza', 'Dakahlia', 'Sharqia'].map(gov => ({
      governorate: gov,
      price: this.egyptPrices[gov] || 0
    }));
    
    const saudiGovernorates = ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina'].map(gov => ({
      governorate: gov,
      price: this.saudiPrices[gov] || 0
    }));
    
    const omanGovernorates = ['Muscat', 'Seeb', 'Salalah', 'Sohar', 'Nizwa'].map(gov => ({
      governorate: gov,
      price: this.omanPrices[gov] || 0
    }));

    const companyData: ShippingCompany = {
      id: this.isEditShipping ? this.editingShippingId! : Date.now().toString(),
      name: this.shippingForm.name,
      logo: this.shippingForm.logo,
      countries: [
        {
          country: 'egypt',
          currency: this.egyptCurrency,
          governorates: egyptGovernorates
        },
        {
          country: 'saudi',
          currency: this.saudiCurrency,
          governorates: saudiGovernorates
        },
        {
          country: 'oman',
          currency: this.omanCurrency,
          governorates: omanGovernorates
        }
      ],
      createdAt: new Date()
    };

    if (this.isEditShipping) {
      this.shippingService.updateShippingCompany(companyData.id, companyData).subscribe(() => {
        this.loadShippingCompanies();
        this.closeShippingModal();
      });
    } else {
      this.shippingService.addShippingCompany(companyData).subscribe(() => {
        this.loadShippingCompanies();
        this.closeShippingModal();
      });
    }
  }

  deleteShipping(id: string): void {
    if (confirm('Are you sure you want to delete this shipping company?')) {
      this.shippingService.deleteShippingCompany(id).subscribe(() => {
        this.loadShippingCompanies();
      });
    }
  }

  translateCountry(country: string): string {
    const countryNames: { [key: string]: string } = {
      'egypt': this.currentLang === 'ar' ? 'مصر' : 'Egypt',
      'saudi': this.currentLang === 'ar' ? 'السعودية' : 'Saudi Arabia',
      'oman': this.currentLang === 'ar' ? 'عمان' : 'Oman'
    };
    return countryNames[country] || country;
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
      pricesByCountry: {
        egypt: '',
        saudi: '',
        oman: ''
      },
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
      pricesByCountry: {
        egypt: product.pricesByCountry?.egypt?.toString() || '',
        saudi: product.pricesByCountry?.saudi?.toString() || '',
        oman: product.pricesByCountry?.oman?.toString() || ''
      },
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
      stock: parseInt(this.productForm.stock),
      pricesByCountry: {
        egypt: this.productForm.pricesByCountry.egypt ? parseFloat(this.productForm.pricesByCountry.egypt) : undefined,
        saudi: this.productForm.pricesByCountry.saudi ? parseFloat(this.productForm.pricesByCountry.saudi) : undefined,
        oman: this.productForm.pricesByCountry.oman ? parseFloat(this.productForm.pricesByCountry.oman) : undefined
      }
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
