export enum OtpTypes {
  REGISTER = 'Register',
}

export const DEFAULT_OTP_TYPE = OtpTypes.REGISTER;

export type OtpValidationType = {
  email: string;
  otp: string;
  isRemoved?: boolean;
  type?: OtpTypes;
};
