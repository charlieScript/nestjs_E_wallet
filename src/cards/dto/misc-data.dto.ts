import { IsNotEmpty, Length } from 'class-validator';

export class PINDto {
  @IsNotEmpty()
  ref: string;

  @Length(4, 4)
  @IsNotEmpty()
  pin: number;
}

export class OTPDto {
  @IsNotEmpty()
  ref: string;

  @Length(3, 3)
  @IsNotEmpty()
  otp: number;
}

export class PhoneDto {
  @IsNotEmpty()
  ref: string;

  @Length(11, 11)
  @IsNotEmpty()
  phone: number;
}
