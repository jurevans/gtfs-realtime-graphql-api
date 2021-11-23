import { ArgsType, Int, Field } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { FilterArgs } from './filter.args';

@ArgsType()
export class RouteFilterArgs extends FilterArgs {
  @Field(() => Int, { nullable: true })
  @IsInt()
  minutes?: number;

  @Field({ nullable: true })
  timezone?: string;
}
