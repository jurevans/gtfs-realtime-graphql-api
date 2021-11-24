import { Field, Int, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class FeedArgs {
  @Field(() => Int)
  feedIndex: number;
}
