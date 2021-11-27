import { IsNotEmpty, Length } from 'class-validator';

export class CardDto {
  @Length(16, 16)
  @IsNotEmpty()
  number: number;

  @Length(3, 3)
  @IsNotEmpty()
  cvv: number;

  @Length(2, 2)
  @IsNotEmpty()
  expiry_year: number;

  @Length(2, 2)
  @IsNotEmpty()
  expiry_month: number;

  @IsNotEmpty()
  amount: number;
}
