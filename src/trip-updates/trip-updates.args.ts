import { ArgsType, Int, Field } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { FilterRoutesArgs } from 'args/filter-routes.args';

@ArgsType()
export class FilterTripUpdatesArgs extends FilterRoutesArgs {
  @Field(() => Int, { nullable: true })
  @IsInt()
  minutes?: number;

  @Field({ nullable: true })
  timezone?: string;
}
