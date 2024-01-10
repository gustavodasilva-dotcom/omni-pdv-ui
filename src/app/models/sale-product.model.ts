import { Product } from './product.model';

export interface SaleProduct {
  uid: string,
  order: number,
  quantity: number,
  product: Product,
  deleted: boolean
};