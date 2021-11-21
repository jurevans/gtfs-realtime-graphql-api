import { Field, ObjectType, Int } from '@nestjs/graphql';
import { VehiclePosition } from 'proto/gtfs-realtime';
import { TripDescriptorEntity } from 'entities/trip-descriptor.entity';
import { VehicleDescriptorEntity } from 'entities/vehicle-descriptor.entity';
import { PositionEntity } from './position.entity';

@ObjectType()
export class VehiclePositionEntity {
  @Field(() => TripDescriptorEntity)
  trip: TripDescriptorEntity;

  @Field(() => VehicleDescriptorEntity)
  vehicle: VehicleDescriptorEntity;

  @Field(() => PositionEntity, { nullable: true })
  position: PositionEntity;

  @Field(() => Int)
  currentStopSequence: number;

  @Field()
  stopId: string;

  @Field()
  currentStatus: string;

  @Field(() => Int)
  timestamp: number;

  @Field()
  congestionLevel: string;

  @Field()
  occupancyStatus: string;

  constructor(partial?: VehiclePosition) {
    Object.assign(this, partial);
  }
}
