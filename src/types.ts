export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  isOpen: boolean;
  phone: string;
  isVerified: boolean;
  payment_verified: boolean;
  rating: number;
  logoUrl: string;
  address?: string;
  schedule?: string;
  deliveryZone?: string;
  deliveryArea?: string;
  minDeliveryAmount?: string;
  enviosAPartirDe?: string;
  paymentMethods?: string[];
  paymentMethod?: string;
  orderSystem?: 'whatsapp' | 'internal';
  lat?: number;
  lng?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  imageUrl: string;
  modelUrl?: string;
  viewCount?: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Category = 'Todos' | 'Comida' | 'Salud' | 'Retail' | 'Servicios';
