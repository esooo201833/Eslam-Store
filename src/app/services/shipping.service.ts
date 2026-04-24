import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ShippingCompany } from '../models/shipping.model';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private shippingCompanies: ShippingCompany[] = [
    {
      id: '1',
      name: 'Aramex',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Aramex_logo.svg/200px-Aramex_logo.svg.png',
      countries: [
        {
          country: 'egypt',
          currency: 'EGP',
          governorates: [
            { governorate: 'Cairo', price: 50 },
            { governorate: 'Alexandria', price: 60 },
            { governorate: 'Giza', price: 55 },
            { governorate: 'Dakahlia', price: 70 },
            { governorate: 'Sharqia', price: 65 }
          ]
        },
        {
          country: 'saudi',
          currency: 'SAR',
          governorates: [
            { governorate: 'Riyadh', price: 40 },
            { governorate: 'Jeddah', price: 45 },
            { governorate: 'Dammam', price: 50 },
            { governorate: 'Mecca', price: 45 },
            { governorate: 'Medina', price: 50 }
          ]
        },
        {
          country: 'oman',
          currency: 'OMR',
          governorates: [
            { governorate: 'Muscat', price: 35 },
            { governorate: 'Seeb', price: 40 },
            { governorate: 'Salalah', price: 55 },
            { governorate: 'Sohar', price: 45 },
            { governorate: 'Nizwa', price: 50 }
          ]
        }
      ],
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'FedEx',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/FedEx_Logo.svg/200px-FedEx_Logo.svg.png',
      countries: [
        {
          country: 'egypt',
          currency: 'EGP',
          governorates: [
            { governorate: 'Cairo', price: 80 },
            { governorate: 'Alexandria', price: 90 },
            { governorate: 'Giza', price: 85 },
            { governorate: 'Dakahlia', price: 100 },
            { governorate: 'Sharqia', price: 95 }
          ]
        },
        {
          country: 'saudi',
          currency: 'SAR',
          governorates: [
            { governorate: 'Riyadh', price: 70 },
            { governorate: 'Jeddah', price: 75 },
            { governorate: 'Dammam', price: 80 },
            { governorate: 'Mecca', price: 75 },
            { governorate: 'Medina', price: 80 }
          ]
        },
        {
          country: 'oman',
          currency: 'OMR',
          governorates: [
            { governorate: 'Muscat', price: 65 },
            { governorate: 'Seeb', price: 70 },
            { governorate: 'Salalah', price: 85 },
            { governorate: 'Sohar', price: 75 },
            { governorate: 'Nizwa', price: 80 }
          ]
        }
      ],
      createdAt: new Date('2024-01-02')
    }
  ];

  getShippingCompanies(): Observable<ShippingCompany[]> {
    return of(this.shippingCompanies);
  }

  getShippingCompanyById(id: string): Observable<ShippingCompany | undefined> {
    return of(this.shippingCompanies.find(c => c.id === id));
  }

  addShippingCompany(company: ShippingCompany): Observable<ShippingCompany> {
    company.id = Date.now().toString();
    company.createdAt = new Date();
    this.shippingCompanies.push(company);
    return of(company);
  }

  updateShippingCompany(id: string, company: ShippingCompany): Observable<ShippingCompany> {
    const index = this.shippingCompanies.findIndex(c => c.id === id);
    if (index !== -1) {
      this.shippingCompanies[index] = company;
    }
    return of(company);
  }

  deleteShippingCompany(id: string): Observable<boolean> {
    const index = this.shippingCompanies.findIndex(c => c.id === id);
    if (index !== -1) {
      this.shippingCompanies.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  getShippingPrice(companyId: string, country: string, governorate: string): number {
    const company = this.shippingCompanies.find(c => c.id === companyId);
    if (!company) return 0;

    const countryData = company.countries.find(c => c.country === country);
    if (!countryData) return 0;

    const governorateData = countryData.governorates.find(g => g.governorate === governorate);
    return governorateData ? governorateData.price : 0;
  }
}
