interface DefaultOptionsCallback {
  save: Function,
  cancel: Function
};

export interface ClientModel {
  name: string,
  ssn: string,
  birthday: string,
  active: true
};

export interface DefaultOptions {
  id: string,
  model: ClientModel,
  callbacks: DefaultOptionsCallback
};