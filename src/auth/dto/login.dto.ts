import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

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
