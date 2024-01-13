import { AddClientToSale } from '../../../../services/sales/models/add-client-to-sale.model'

interface DefaultOptionsCallback {
  save: Function,
  cancel: Function
};

export interface DefaultOptions {
  model: AddClientToSale,
  callbacks: DefaultOptionsCallback
};