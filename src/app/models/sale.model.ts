import { Guid } from 'guid-typescript'
import { Discount } from './discount.model'
import { SaleStatusEnum } from './enums/sale-status.enum'
import { SaleProduct } from './sale-product.model'

export interface Sale {
  id: Guid,
  number: number,
  subtotal: number,
  discount: Discount,
  total: number,
  products: SaleProduct[],
  status: SaleStatusEnum,
  sale_date: Date
};