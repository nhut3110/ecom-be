export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  picture: string;
  shippingPoint?: number;
  provider?: string;
}
