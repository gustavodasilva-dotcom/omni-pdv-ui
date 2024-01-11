interface DefaultOptionsCallback {
  save: Function,
  cancel: Function
};

export interface ManufacturerModel {
  name: string,
  crn: string,
  active: true
};

export interface DefaultOptions {
  id: string,
  model: ManufacturerModel,
  callbacks: DefaultOptionsCallback
};