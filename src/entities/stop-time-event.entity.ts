import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StopTimeEventEntity {
  @Field(() => Int)
  delay: number;

  @Field(() => Int)
  time: number;

  @Field(() => Int)
  uncertainty: number;
}
