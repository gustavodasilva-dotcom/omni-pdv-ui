import { Guid } from 'guid-typescript'
import { Product } from './product.model'

export interface SaleProduct {
  id: Guid,
  order: number,
  quantity: number,
  product: Product,
  deleted: boolean
};