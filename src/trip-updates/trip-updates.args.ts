import { ArgsType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsArray, Min } from 'class-validator';

@ArgsType()
export class GetTripUpdatesArgs {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  feedIndex: number;

  @Field(() => [String])
  @IsArray()
  routeIds: string[];
}
