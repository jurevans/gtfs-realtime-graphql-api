import { Field, ObjectType } from '@nestjs/graphql';
import { Alert } from 'proto/gtfs-realtime';
import { EntitySelectorEntity } from 'entities/entity-selector.entity';
import { TimeRangeEntity } from 'entities/timerange.entity';
import { TranslationStringEntity } from 'entities/translation-string.entity';

@ObjectType()
export class AlertEntity {
  @Field(() => [TimeRangeEntity])
  activePeriod: TimeRangeEntity[];

  @Field(() => [EntitySelectorEntity])
  informedEntity: EntitySelectorEntity[];

  @Field()
  cause: string;

  @Field()
  effect: string;

  @Field({ nullable: true })
  url?: string;

  @Field(() => TranslationStringEntity)
  headerText: TranslationStringEntity;

  @Field(() => TranslationStringEntity)
  descriptionText: TranslationStringEntity;

  constructor(partial?: Alert) {
    Object.assign(this, partial);
  }
}
