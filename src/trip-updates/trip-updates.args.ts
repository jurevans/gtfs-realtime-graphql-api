import { ArgsType, Int, Field } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { FeedArgs } from 'args/feed.args';

@ArgsType()
export class GetTripUpdatesArgs extends FeedArgs {
  @Field(() => Int, { nullable: true })
  @IsInt()
  minutes?: number;

  @Field({ nullable: true })
  timezone?: string;
}
