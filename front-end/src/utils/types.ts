export interface Product {
  id: number;
  productName: string;
  quantityInStock: number;
  quantitySold: number;
  unitPrice: number;
  revenue: number;
}

export interface ProductFormData {
  productName: string;
  quantityInStock: string;
  quantitySold: string;
  unitPrice: string;
}
