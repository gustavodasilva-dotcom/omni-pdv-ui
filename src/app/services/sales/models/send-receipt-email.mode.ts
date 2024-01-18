import { Guid } from 'guid-typescript'

export interface SendReceiptToEmail {
  sale_id: Guid,
  email: string | undefined
};