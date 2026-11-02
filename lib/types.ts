export type ProductCategory =
  | "tablets"
  | "syrups"
  | "injectables"
  | "ointments";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  dosage?: string;
  uses?: string[];
  sideEffects?: string[];
  featured?: boolean;
  active?: boolean;
  rating?: number;
  reviews?: number;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  description: string;
  active?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  approved?: boolean;
}

export interface Career {
  id: string;
  title: string;
  location: string;
  type: string;
  department: string;
  description: string;
  requirements: string[];
  active: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock?: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  userId: string;
  email: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  createdAt: string;
}

export interface AuthUser {
  uid: string;
  email: string;
  name: string;
  role: "admin" | "customer";
}

export interface DemoUserRecord {
  uid: string;
  email: string;
  name: string;
  password: string;
  role: "admin" | "customer";
}

export interface JobApplication {
  id: string;
  careerId: string;
  careerTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
