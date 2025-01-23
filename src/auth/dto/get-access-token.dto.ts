import { Field, InputType } from "@nestjs/graphql";
import { IsJWT, IsNotEmpty } from "class-validator";

@InputType()
export class GetAccessTokenDto {
    @IsJWT()
    @IsNotEmpty()
    @Field()
    refreshToken!: string;
}
