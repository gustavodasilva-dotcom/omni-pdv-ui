import { Manufacturer } from './manufacturer.model';

export interface Product {
  uid: string,
  name: string,
  description: string,
  wholesale_price: number,
  retail_price: number,
  barcode: string,
  manufacturer: Manufacturer,
  active: boolean
}