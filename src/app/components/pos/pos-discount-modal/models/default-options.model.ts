import { AddDiscountToSale } from '../../../../services/sales/models/add-discount-to-sale.model'

interface DefaultOptionsCallback {
  save: Function,
  cancel: Function
};

export interface DefaultOptions {
  model: AddDiscountToSale,
  callbacks: DefaultOptionsCallback
};