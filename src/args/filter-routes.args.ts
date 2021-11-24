import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class FilterRoutesArgs {
  @Field(() => [String], { defaultValue: [] })
  routeIds: string[];
}
