import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { CountryService } from './country.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    // Electronics
    {
      id: '1',
      name: 'Sony WH-1000XM5 Wireless Headphones',
      price: 349.99,
      pricesByCountry: {},
      description: 'Industry-leading noise cancellation with exceptional sound quality and 30-hour battery life.',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
      category: 'Electronics',
      stock: 50,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Apple Watch Series 9',
      price: 399.99,
      pricesByCountry: {},
      description: 'Advanced smartwatch with health monitoring, GPS, always-on display, and 18-hour battery life.',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
      category: 'Electronics',
      stock: 35,
      createdAt: new Date('2024-01-02')
    },
    {
      id: '3',
      name: 'MacBook Pro 14" M3',
      price: 1999.99,
      pricesByCountry: {},
      description: 'Powerful laptop with M3 chip, 14-inch Liquid Retina XDR display, and 18-hour battery.',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      category: 'Electronics',
      stock: 20,
      createdAt: new Date('2024-01-03')
    },
    {
      id: '4',
      name: 'iPhone 15 Pro Max',
      price: 1199.99,
      pricesByCountry: {},
      description: 'The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system.',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
      category: 'Electronics',
      stock: 45,
      createdAt: new Date('2024-01-04')
    },
    {
      id: '5',
      name: 'Samsung Galaxy S24 Ultra',
      price: 1299.99,
      pricesByCountry: {},
      description: 'Premium Android smartphone with S Pen, 200MP camera, and AI-powered features.',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
      category: 'Electronics',
      stock: 40,
      createdAt: new Date('2024-01-05')
    },
    {
      id: '6',
      name: 'DJI Mavic 3 Pro Drone',
      price: 2199.99,
      pricesByCountry: {},
      description: 'Professional drone with Hasselblad camera, 43-minute flight time, and omnidirectional sensing.',
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
      category: 'Electronics',
      stock: 15,
      createdAt: new Date('2024-01-06')
    },
    {
      id: '7',
      name: 'Sony A7 IV Camera',
      price: 2499.99,
      pricesByCountry: {},
      description: 'Full-frame mirrorless camera with 33MP sensor, 4K video, and advanced autofocus.',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
      category: 'Electronics',
      stock: 25,
      createdAt: new Date('2024-01-07')
    },
    {
      id: '8',
      name: 'AirPods Pro 2nd Gen',
      price: 249.99,
      pricesByCountry: {},
      description: 'Next-generation AirPods with adaptive audio, personalized spatial audio, and MagSafe charging.',
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80',
      category: 'Electronics',
      stock: 60,
      createdAt: new Date('2024-01-08')
    },
    // Clothing
    {
      id: '9',
      name: 'Premium Leather Jacket',
      price: 449.99,
      pricesByCountry: {},
      description: 'Handcrafted genuine leather jacket with premium stitching and timeless design.',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
      category: 'Clothing',
      stock: 30,
      createdAt: new Date('2024-01-09')
    },
    {
      id: '10',
      name: 'Designer Silk Dress',
      price: 299.99,
      pricesByCountry: {},
      description: 'Elegant silk dress with intricate embroidery, perfect for special occasions.',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
      category: 'Clothing',
      stock: 25,
      createdAt: new Date('2024-01-10')
    },
    {
      id: '11',
      name: 'Premium Denim Jeans',
      price: 149.99,
      pricesByCountry: {},
      description: 'High-quality selvedge denim jeans with perfect fit and durable construction.',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
      category: 'Clothing',
      stock: 50,
      createdAt: new Date('2024-01-11')
    },
    {
      id: '12',
      name: 'Cashmere Sweater',
      price: 199.99,
      pricesByCountry: {},
      description: 'Luxurious 100% cashmere sweater with soft touch and elegant silhouette.',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
      category: 'Clothing',
      stock: 35,
      createdAt: new Date('2024-01-12')
    },
    {
      id: '13',
      name: 'Designer Handbag',
      price: 599.99,
      pricesByCountry: {},
      description: 'Luxury handbag crafted from premium Italian leather with gold hardware.',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
      category: 'Clothing',
      stock: 20,
      createdAt: new Date('2024-01-13')
    },
    {
      id: '14',
      name: 'Premium Cotton T-Shirt',
      price: 79.99,
      pricesByCountry: {},
      description: 'Ultra-soft organic cotton t-shirt with modern fit and premium finish.',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      category: 'Clothing',
      stock: 80,
      createdAt: new Date('2024-01-14')
    },
    {
      id: '15',
      name: 'Wool Blend Coat',
      price: 399.99,
      pricesByCountry: {},
      description: 'Elegant wool blend coat with tailored fit and classic design.',
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
      category: 'Clothing',
      stock: 25,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '16',
      name: 'Running Sneakers',
      price: 179.99,
      pricesByCountry: {},
      description: 'High-performance running shoes with responsive cushioning and breathable mesh.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      category: 'Clothing',
      stock: 45,
      createdAt: new Date('2024-01-16')
    },
    // Accessories
    {
      id: '17',
      name: 'Luxury Watch',
      price: 2499.99,
      pricesByCountry: {},
      description: 'Swiss-made automatic watch with sapphire crystal and leather strap.',
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
      category: 'Accessories',
      stock: 15,
      createdAt: new Date('2024-01-17')
    },
    {
      id: '18',
      name: 'Designer Sunglasses',
      price: 299.99,
      pricesByCountry: {},
      description: 'Premium polarized sunglasses with UV protection and titanium frame.',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
      category: 'Accessories',
      stock: 40,
      createdAt: new Date('2024-01-18')
    },
    {
      id: '19',
      name: 'Leather Belt',
      price: 89.99,
      pricesByCountry: {},
      description: 'Handcrafted leather belt with brushed metal buckle.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      category: 'Accessories',
      stock: 60,
      createdAt: new Date('2024-01-19')
    },
    {
      id: '20',
      name: 'Premium Backpack',
      price: 199.99,
      pricesByCountry: {},
      description: 'Durable leather backpack with laptop compartment and organizer pockets.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      category: 'Accessories',
      stock: 35,
      createdAt: new Date('2024-01-20')
    },
    {
      id: '21',
      name: 'Silk Scarf',
      price: 129.99,
      pricesByCountry: {},
      description: 'Hand-printed silk scarf with artistic patterns and premium finish.',
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80',
      category: 'Accessories',
      stock: 45,
      createdAt: new Date('2024-01-21')
    },
    {
      id: '22',
      name: 'Leather Wallet',
      price: 149.99,
      pricesByCountry: {},
      description: 'Slim leather wallet with RFID protection and multiple card slots.',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
      category: 'Accessories',
      stock: 55,
      createdAt: new Date('2024-01-22')
    },
    {
      id: '23',
      name: 'Designer Bracelet',
      price: 199.99,
      pricesByCountry: {},
      description: 'Elegant silver bracelet with intricate design and premium finish.',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
      category: 'Accessories',
      stock: 30,
      createdAt: new Date('2024-01-23')
    },
    {
      id: '24',
      name: 'Travel Luggage Set',
      price: 499.99,
      pricesByCountry: {},
      description: 'Premium hard-shell luggage set with TSA locks and 360° wheels.',
      image: 'https://images.unsplash.com/photo-1553247407-23251ce81f59?w=800&q=80',
      category: 'Accessories',
      stock: 20,
      createdAt: new Date('2024-01-24')
    }
  ];

  constructor(private countryService: CountryService) {}

  getPriceByCountry(product: Product): number {
    const countryCode = this.countryService.getCountry();
    if (countryCode && product.pricesByCountry[countryCode as keyof typeof product.pricesByCountry]) {
      return product.pricesByCountry[countryCode as keyof typeof product.pricesByCountry]!;
    }
    return product.price;
  }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: string): Observable<Product | undefined> {
    return of(this.products.find(p => p.id === id));
  }

  addProduct(product: Product): Observable<Product> {
    const newProduct = { ...product, id: Date.now().toString(), createdAt: new Date() };
    this.products.push(newProduct);
    return of(newProduct);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product | undefined> {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...product };
      return of(this.products[index]);
    }
    return of(undefined);
  }

  deleteProduct(id: string): Observable<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  searchProducts(query: string): Observable<Product[]> {
    const filtered = this.products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered);
  }

  filterByCategory(category: string): Observable<Product[]> {
    if (category === 'all') {
      return of(this.products);
    }
    return of(this.products.filter(p => p.category === category));
  }

  filterByPrice(minPrice: number, maxPrice: number): Observable<Product[]> {
    return of(this.products.filter(p => p.price >= minPrice && p.price <= maxPrice));
  }

  getCategories(): Observable<string[]> {
    const categories = [...new Set(this.products.map(p => p.category))];
    return of(categories);
  }
}
