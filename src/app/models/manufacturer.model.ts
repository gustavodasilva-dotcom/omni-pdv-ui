import { Guid } from 'guid-typescript'

export interface Manufacturer {
  id: Guid,
  name: string,
  crn: string,
  active: boolean
}