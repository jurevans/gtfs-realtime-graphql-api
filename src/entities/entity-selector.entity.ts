import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TripDescriptorEntity } from './trip-descriptor.entity';

@ObjectType()
export class EntitySelectorEntity {
  @Field()
  agencyId: string;

  @Field()
  routeId: string;

  @Field(() => Int)
  routeType: number;

  @Field(() => TripDescriptorEntity)
  trip: TripDescriptorEntity | undefined;

  @Field()
  stopId: string;
}
