import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class FilterArgs {
  @Field(() => [String], { defaultValue: [] })
  routeIds: string[];
}
