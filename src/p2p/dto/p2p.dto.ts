import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class p2pDto {
  @IsNotEmpty()
  @IsEmail()
  reciever: string;

  @IsNumber({ allowInfinity: false })
  @IsNotEmpty()
  amount: number;
}
