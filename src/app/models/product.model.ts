export interface Product {
  id: string;
  name: string;
  price: number;
  pricesByCountry: {
    egypt?: number;
    saudi?: number;
    oman?: number;
  };
  description: string;
  image: string;
  category: string;
  stock: number;
  createdAt: Date;
}
