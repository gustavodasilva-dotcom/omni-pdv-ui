import { DiscountTypeEnum } from './enums/discount-type-enum';

export interface Discount
{
  type: DiscountTypeEnum,
  value: number
}