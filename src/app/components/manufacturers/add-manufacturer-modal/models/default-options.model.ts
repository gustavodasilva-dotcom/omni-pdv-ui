import { SaveManufacturer } from '../../../../services/manufacturers/models/save-manufacturer.model'

interface DefaultOptionsCallback {
  save: Function,
  cancel: Function
};

export interface DefaultOptions {
  id: string,
  model: SaveManufacturer,
  callbacks: DefaultOptionsCallback
};