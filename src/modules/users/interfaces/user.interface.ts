export interface IUser {
  name: string;
  email: string;
  password: string;
  picture: string;
  shippingPoint?: number;
  provider?: string;
}
