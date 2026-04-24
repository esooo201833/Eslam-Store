import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryService, Country } from '../../services/country.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-country-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 transform transition-all duration-300 animate-scale-in">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-3">
              {{ translate('selectCountry') }}
            </h2>
            <p class="text-gray-600">
              {{ translate('selectCountryDesc') }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            @for (country of countries; track country.code) {
              <button
                (click)="selectCountry(country.code)"
                class="relative p-6 border-2 border-gray-200 rounded-2xl hover:border-gray-900 hover:shadow-lg transition-all duration-300 group"
              >
                <div class="text-5xl mb-3">{{ country.flag }}</div>
                <div class="font-bold text-lg text-gray-900 group-hover:text-black">
                  {{ currentLang === 'ar' ? country.nameAr : country.name }}
                </div>
                <div class="text-sm text-gray-500 mt-1">
                  {{ country.currency }}
                </div>
              </button>
            }
          </div>

          <p class="text-center text-sm text-gray-500">
            {{ translate('countryNote') }}
          </p>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scale-in {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }
    .animate-scale-in {
      animation: scale-in 0.3s ease-out;
    }
  `]
})
export class CountryModalComponent {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();

  countries: Country[] = [];
  currentLang: 'ar' | 'en' = 'ar';

  constructor(
    private countryService: CountryService,
    private languageService: LanguageService
  ) {
    this.countries = this.countryService.getCountries();
    this.currentLang = this.languageService.getLanguage();
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  selectCountry(countryCode: string): void {
    this.countryService.setCountry(countryCode);
    this.onClose.emit();
  }

  translate(key: string): string {
    const translations: { [key: string]: { ar: string; en: string } } = {
      selectCountry: {
        ar: 'اختر دولتك',
        en: 'Select Your Country'
      },
      selectCountryDesc: {
        ar: 'اختر دولتك لعرض الأسعار المناسبة لمنطقتك',
        en: 'Choose your country to see prices in your region'
      },
      countryNote: {
        ar: 'يمكنك تغيير الدولة لاحقاً من الإعدادات',
        en: 'You can change your country later in settings'
      }
    };
    return translations[key]?.[this.currentLang] || key;
  }
}
