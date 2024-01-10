import { Discount } from './discount.model'
import { SaleStatusEnum } from './enums/sale-status.enum'
import { SaleProduct } from './sale-product.model'

export interface Sale {
  uid: string,
  subtotal: number,
  discount: Discount,
  total: number,
  products: SaleProduct[],
  status: SaleStatusEnum,
  sale_date: Date
};