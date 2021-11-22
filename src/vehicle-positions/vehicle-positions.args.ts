import { ArgsType, Int, Field } from '@nestjs/graphql';
import { IsArray, IsInt, Min } from 'class-validator';

@ArgsType()
export class GetVehiclePositionsArgs {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  feedIndex: number;

  @Field(() => [String])
  @IsArray()
  routeIds: string[];
}
