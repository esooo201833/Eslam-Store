export interface ShippingCompany {
  id: string;
  name: string;
  logo?: string;
  countries: CountryShipping[];
  createdAt: Date;
}

export interface CountryShipping {
  country: string;
  currency: string;
  governorates: GovernorateShipping[];
}

export interface GovernorateShipping {
  governorate: string;
  price: number;
}
