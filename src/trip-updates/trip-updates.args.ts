import { ArgsType, Int, Field } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@ArgsType()
export class GetTripUpdatesArgs {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  feedIndex: number;
}
