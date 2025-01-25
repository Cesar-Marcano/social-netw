import { IsJWT, IsNotEmpty } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetAccessTokenDto {
  @IsJWT()
  @IsNotEmpty()
  @Field()
  refreshToken!: string;
}
