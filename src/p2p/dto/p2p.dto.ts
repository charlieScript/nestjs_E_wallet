import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class p2pDto {
  @IsNotEmpty()
  @IsEmail()
  sender: number;

  @IsNotEmpty()
  @IsEmail()
  reciever: number;

  @IsNumber({ allowInfinity: false })
  @IsNotEmpty()
  amount: number;
}
