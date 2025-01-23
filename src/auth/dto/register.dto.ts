import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';
import { User } from 'src/user/user.schema';

@InputType()
export class RegisterDto implements User {
  @IsString()
  @Field()
  @Length(6, 10)
  username!: string;

  @IsStrongPassword()
  @IsString()
  @Field()
  password!: string;

  @IsEmail()
  @IsString()
  @Field()
  email!: string;
}
