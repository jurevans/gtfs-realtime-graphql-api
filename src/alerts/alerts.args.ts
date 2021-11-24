import { ArgsType, Field, Int } from '@nestjs/graphql';
import { FeedArgs } from 'args/feed.args';

@ArgsType()
export class GetAlertsArgs extends FeedArgs {
  @Field(() => [String], { nullable: true })
  translation?: string[];

  @Field(() => Int, { nullable: true })
  start?: number;

  @Field(() => Int, { nullable: true })
  end?: number;
}
