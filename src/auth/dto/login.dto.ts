import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  password!: string;

  @IsEmail()
  @IsString()
  @Field()
  email!: string;
}
