import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetVehiclePositionsArgs {
  @Field(() => Int)
  feedIndex: number;

  @Field({ nullable: true })
  stopId?: string;

  @Field({ nullable: true })
  currentStatus?: string;
}

@ArgsType()
export class FilterVehiclePositionsArgs {
  @Field(() => [String], { defaultValue: [] })
  routeIds: string[];
}
