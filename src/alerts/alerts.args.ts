import { ArgsType, Int, Field } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@ArgsType()
export class GetAlertsArgs {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  feedIndex: number;
}
