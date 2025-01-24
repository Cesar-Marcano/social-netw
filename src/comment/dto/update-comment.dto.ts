import { Types } from 'mongoose';
import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString, Length, ValidateNested } from 'class-validator';
import CreateCommentDto from './create-comment.dto';

@InputType()
export class NewCommentContentDto implements Partial<CreateCommentDto> {
  @IsString()
  @Length(1, 512)
  @Field()
  content!: string;
}

@InputType()
export class UpdateCommentDto {
  @IsMongoId()
  @Field(() => String)
  commentId!: Types.ObjectId;

  @ValidateNested()
  @Field(() => NewCommentContentDto)
  newCommentContent!: NewCommentContentDto;
}
