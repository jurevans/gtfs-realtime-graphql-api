import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PositionEntity {
  @Field(() => Int, { nullable: true })
  latitude?: number;

  @Field(() => Int, { nullable: true })
  longitude?: number;

  @Field(() => Int, { nullable: true })
  bearing?: number;

  @Field(() => Int, { nullable: true })
  odometer?: number;

  @Field(() => Int, { nullable: true })
  speed?: number;
}
