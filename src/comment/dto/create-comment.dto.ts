import {Field, InputType} from "@nestjs/graphql"
import { Types } from "mongoose"
import { IsMongoId, IsString, Length } from "class-validator"

@InputType()
export default class CreateCommentDto {
    @IsMongoId()
    @Field(() => String)
    post!: Types.ObjectId

    @IsString()
    @Length(1, 512)
    content!: string
}