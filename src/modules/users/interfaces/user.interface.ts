export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  picture: string;
  shippingPoint?: number;
  provider?: string;
}
