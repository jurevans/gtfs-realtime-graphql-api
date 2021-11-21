import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TripDescriptorEntity {
  @Field()
  tripId: string;

  @Field()
  routeId: string;

  @Field(() => Int)
  directionId: number;

  @Field()
  startTime: string;

  @Field()
  startDate: string;

  @Field(() => Int)
  scheduleRelationship: number;
}
