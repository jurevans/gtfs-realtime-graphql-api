import { ArgsType, Int, Field } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@ArgsType()
export class GetTripUpdatesArgs {
  @Field(() => Int)
  feedIndex: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  minutes?: number;

  @Field({ nullable: true })
  timezone?: string;
}

@ArgsType()
export class FilterTripUpdatesArgs {
  @Field(() => [String], { defaultValue: [] })
  routeIds: string[];
}
