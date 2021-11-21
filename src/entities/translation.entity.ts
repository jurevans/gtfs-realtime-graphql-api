import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TranslationEntity {
  @Field()
  text: string;

  @Field()
  language: string;
}
