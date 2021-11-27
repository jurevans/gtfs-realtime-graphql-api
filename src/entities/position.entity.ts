import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PositionEntity {
  @Field(() => Float, { nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  longitude?: number;

  @Field(() => Int, { nullable: true })
  bearing?: number;

  @Field(() => Int, { nullable: true })
  odometer?: number;

  @Field(() => Int, { nullable: true })
  speed?: number;
}
