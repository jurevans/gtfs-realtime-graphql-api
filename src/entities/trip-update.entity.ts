import { Field, ObjectType, Int } from '@nestjs/graphql';
import { TripUpdate } from 'proto/gtfs-realtime';
import { TripDescriptorEntity } from 'entities/trip-descriptor.entity';
import { VehicleDescriptorEntity } from 'entities/vehicle-descriptor.entity';
import { StopTimeUpdateEntity } from 'entities/stop-time-update.entity';

@ObjectType()
export class TripUpdateEntity {
  @Field(() => TripDescriptorEntity)
  trip: TripDescriptorEntity;

  @Field(() => VehicleDescriptorEntity)
  vehicle: VehicleDescriptorEntity;

  @Field(() => [StopTimeUpdateEntity])
  stopTimeUpdate: StopTimeUpdateEntity[];

  @Field(() => Int)
  timestamp: number;

  @Field(() => Int)
  delay: number;

  constructor(partial?: TripUpdate) {
    Object.assign(this, partial);
  }
}
