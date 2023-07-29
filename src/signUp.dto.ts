/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsEmail()
  @Matches(/^\w+([\.+]*?\w+[\+]*)@\w+(\w+)(\.\w{2,3})+$/)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+~`\-=[\]{}|:;"'<>,.?/])(?!.*\s).{6,}$/,
  )
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}

export class LoginDTO {
  @IsEmail()
  @Matches(/^\w+([\.+]*?\w+[\+]*)@\w+(\w+)(\.\w{2,3})+$/)
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
