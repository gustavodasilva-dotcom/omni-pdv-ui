import { Discount } from '../../../../models/discount.model'

interface DefaultOptionsCallback {
  save: Function,
  cancel: Function
};

export interface DefaultOptions {
  model: Discount,
  callbacks: DefaultOptionsCallback
};