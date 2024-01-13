import { DiscountTypeEnum } from '../../../models/enums/discount-type-enum'

export interface AddDiscountToSale {
  type: DiscountTypeEnum,
  value: number
};