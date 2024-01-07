import { SaleStatus } from './enums/sale-status.enum'
import { SaleProduct } from './sale-product.model'

export interface Sale {
  uid: string,
  subtotal: number,
  discount: number,
  total: number,
  products: SaleProduct[],
  status: SaleStatus,
  sale_date: Date
};