import { SaveProduct } from '../../../../services/products/models/save-product.model'

interface DefaultOptionsCallback {
  save: Function,
  cancel: Function
};

export interface DefaultOptions {
  id: string,
  model: SaveProduct,
  callbacks: DefaultOptionsCallback
};