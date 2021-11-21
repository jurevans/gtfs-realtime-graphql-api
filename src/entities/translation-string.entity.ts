import { Field, ObjectType } from '@nestjs/graphql';
import { TranslationEntity } from 'entities/translation.entity';

@ObjectType()
export class TranslationStringEntity {
  @Field(() => [TranslationEntity])
  translation: TranslationEntity[];
}
