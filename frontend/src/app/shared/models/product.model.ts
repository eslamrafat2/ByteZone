export interface Product {
  _id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  image: string;
  description: string;
  specifications: Record<string, unknown>;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}
