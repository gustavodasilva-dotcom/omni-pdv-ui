import { Product } from "./product.model";

export interface SaleProduct {
  uid: string,
  quantity: number,
  product: Product
};