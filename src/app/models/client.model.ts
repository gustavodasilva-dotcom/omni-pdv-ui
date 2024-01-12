import { Guid } from 'guid-typescript'

export interface Client {
  id: Guid,
  name: string,
  ssn: string,
  birthday: Date,
  active: boolean
};