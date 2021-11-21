import { Field, Int, ObjectType } from '@nestjs/graphql';
import { StopTimeEventEntity } from 'entities/stop-time-event.entity';

@ObjectType()
export class StopTimeUpdateEntity {
  @Field(() => Int)
  stopSequence: number;

  @Field()
  stopId: string;

  @Field(() => StopTimeEventEntity)
  arrival: StopTimeEventEntity;

  @Field(() => StopTimeEventEntity)
  departure: StopTimeEventEntity;

  @Field(() => Int)
  scheduleRelationship: number;
}
