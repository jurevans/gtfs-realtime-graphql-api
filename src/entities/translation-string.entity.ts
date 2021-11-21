import { Field, ObjectType } from '@nestjs/graphql';
import { TranslationEntity } from './translation.entity';

@ObjectType()
export class TranslationStringEntity {
  @Field(() => [TranslationEntity])
  translation: TranslationEntity[];
}
