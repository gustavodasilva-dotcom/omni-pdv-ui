interface DefaultOptionsCallback {
  save: Function,
  cancel: Function
};

export interface ProductModel {
  name: string,
  description: string,
  wholesale_price: number,
  retail_price: number,
  barcode: string,
  manufacturer_id: string,
  active: boolean
};

export interface DefaultOptions {
  id: string,
  model: ProductModel,
  callbacks: DefaultOptionsCallback
};