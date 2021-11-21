import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TimeRangeEntity {
  @Field(() => Int)
  start: number;

  @Field(() => Int)
  end: number;
}
