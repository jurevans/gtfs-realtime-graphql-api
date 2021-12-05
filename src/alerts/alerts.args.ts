import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetAlertsArgs {
  @Field(() => Int)
  feedIndex: number;

  @Field(() => [String], { nullable: true })
  translation?: string[];

  @Field(() => Int, { nullable: true })
  start?: number;

  @Field(() => Int, { nullable: true })
  end?: number;
}

@ArgsType()
export class FilterAlertsArgs {
  @Field(() => [String], { defaultValue: [] })
  routeIds: string[];
}
