import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/layout/navbar.component';
import { FooterComponent } from '../../components/layout/footer.component';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
      <!-- Navbar -->
      <app-navbar [showAdmin]="true"></app-navbar>

      <!-- Hero Section -->
      <section class="relative bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-700 text-white py-24 overflow-hidden">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div class="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">{{ translate('about.title') }}</h1>
          <p class="text-xl text-gray-300 dark:text-gray-400 max-w-3xl mx-auto animate-fade-in-up" style="animation-delay: 0.2s">
            {{ translate('about.subtitle') }}
          </p>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-16 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 text-center transform hover:scale-105 transition-all duration-300">
            <div class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
              {{ stats.visitors }}
            </div>
            <div class="text-gray-600 dark:text-gray-400 font-medium">{{ translate('about.visitors') }}</div>
          </div>
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 text-center transform hover:scale-105 transition-all duration-300">
            <div class="text-5xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">
              {{ stats.orders }}
            </div>
            <div class="text-gray-600 dark:text-gray-400 font-medium">{{ translate('about.orders') }}</div>
          </div>
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 text-center transform hover:scale-105 transition-all duration-300">
            <div class="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">
              {{ stats.customers }}
            </div>
            <div class="text-gray-600 dark:text-gray-400 font-medium">{{ translate('about.customers') }}</div>
          </div>
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 text-center transform hover:scale-105 transition-all duration-300">
            <div class="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent mb-2">
              {{ stats.rating }}
            </div>
            <div class="text-gray-600 dark:text-gray-400 font-medium">{{ translate('about.rating') }}</div>
          </div>
        </div>
      </section>

      <!-- About Content -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">{{ translate('about.ourStory') }}</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {{ translate('about.story1') }}
            </p>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {{ translate('about.story2') }}
            </p>
            <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ translate('about.story3') }}
            </p>
          </div>
          <div class="relative">
            <div class="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-2xl">
              <div class="grid grid-cols-2 gap-6">
                <div class="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                  <div class="text-3xl mb-2">🚀</div>
                  <h3 class="font-bold text-gray-900 dark:text-white mb-2">{{ translate('about.fastDelivery') }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ translate('about.fastDeliveryDesc') }}</p>
                </div>
                <div class="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                  <div class="text-3xl mb-2">🛡️</div>
                  <h3 class="font-bold text-gray-900 dark:text-white mb-2">{{ translate('about.securePayment') }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ translate('about.securePaymentDesc') }}</p>
                </div>
                <div class="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                  <div class="text-3xl mb-2">💎</div>
                  <h3 class="font-bold text-gray-900 dark:text-white mb-2">{{ translate('about.qualityProducts') }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ translate('about.qualityProductsDesc') }}</p>
                </div>
                <div class="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                  <div class="text-3xl mb-2">🎧</div>
                  <h3 class="font-bold text-gray-900 dark:text-white mb-2">{{ translate('about.support247') }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ translate('about.support247Desc') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="bg-white dark:bg-gray-900 py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">{{ translate('about.testimonials') }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            @for (testimonial of testimonials; track testimonial.id) {
              <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {{ testimonial.name.charAt(0) }}
                  </div>
                  <div class="ml-4">
                    <h3 class="font-bold text-gray-900 dark:text-white">{{ testimonial.name }}</h3>
                    <div class="flex text-yellow-400">
                      @for (i of [1,2,3,4,5]; track i) {
                        <span>★</span>
                      }
                    </div>
                  </div>
                </div>
                <p class="text-gray-600 dark:text-gray-400 italic">"{{ testimonial.text }}"</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-12 text-center text-white">
          <h2 class="text-4xl font-bold mb-4">{{ translate('about.readyToShop') }}</h2>
          <p class="text-xl text-gray-300 dark:text-gray-400 mb-8">{{ translate('about.readyToShopDesc') }}</p>
          <button
            routerLink="/products"
            class="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all transform hover:scale-105 shadow-xl"
          >
            {{ translate('about.startShopping') }}
          </button>
        </div>
      </section>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.6s ease-out;
    }
  `]
})
export class AboutComponent implements OnInit {
  stats = {
    visitors: 0,
    orders: 0,
    customers: 0,
    rating: 0
  };
  testimonials = [
    { id: 1, name: 'أحمد محمد', text: 'منتجات ممتازة وتوصيل سريع جداً. أنصح بالشراء من هذا المتجر!' },
    { id: 2, name: 'سارة علي', text: 'أفضل تجربة تسوق أونلاين مررت بها. سأعود بالتأكيد!' },
    { id: 3, name: 'عمر حسن', text: 'منتجات عالية الجودة بأسعار مذهلة. خدمة العملاء ممتازة!' }
  ];
  currentLang: 'ar' | 'en' = 'ar';

  constructor(
    private languageService: LanguageService
  ) {
    this.currentLang = this.languageService.getLanguage();
  }

  ngOnInit(): void {
    this.animateStats();
  }

  animateStats(): void {
    const targetStats = {
      visitors: 1500000,
      orders: 50000,
      customers: 100000,
      rating: 4.9
    };

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      this.stats.visitors = Math.floor(targetStats.visitors * progress);
      this.stats.orders = Math.floor(targetStats.orders * progress);
      this.stats.customers = Math.floor(targetStats.customers * progress);
      this.stats.rating = parseFloat((targetStats.rating * progress).toFixed(1));

      if (currentStep >= steps) {
        clearInterval(timer);
        this.stats = targetStats;
        this.stats.rating = 4.9;
      }
    }, interval);
  }

  translate(key: string): string {
    return this.languageService.translate(key);
  }
}
