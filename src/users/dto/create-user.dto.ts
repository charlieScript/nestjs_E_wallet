// schema rep of object
import { IsEmail, IsNotEmpty, Length, Max, Min } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
