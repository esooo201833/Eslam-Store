import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Country {
  code: string;
  name: string;
  nameAr: string;
  flag: string;
  currency: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private currentCountry = new BehaviorSubject<string>('');
  currentCountry$ = this.currentCountry.asObservable();

  private countries: Country[] = [
    {
      code: 'egypt',
      name: 'Egypt',
      nameAr: 'مصر',
      flag: '🇪🇬',
      currency: 'EGP'
    },
    {
      code: 'saudi',
      name: 'Saudi Arabia',
      nameAr: 'السعودية',
      flag: '🇸🇦',
      currency: 'SAR'
    },
    {
      code: 'oman',
      name: 'Oman',
      nameAr: 'عمان',
      flag: '🇴🇲',
      currency: 'OMR'
    }
  ];

  constructor() {
    // Load saved country from localStorage
    const savedCountry = localStorage.getItem('country');
    if (savedCountry) {
      this.currentCountry.next(savedCountry);
    }
  }

  setCountry(countryCode: string): void {
    this.currentCountry.next(countryCode);
    localStorage.setItem('country', countryCode);
  }

  getCountry(): string {
    return this.currentCountry.value;
  }

  getCountries(): Country[] {
    return this.countries;
  }

  getCountryByCode(code: string): Country | undefined {
    return this.countries.find(c => c.code === code);
  }

  hasSelectedCountry(): boolean {
    return !!this.currentCountry.value;
  }
}
