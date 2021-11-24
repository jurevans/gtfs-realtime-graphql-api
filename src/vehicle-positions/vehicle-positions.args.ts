import { ArgsType, Field } from '@nestjs/graphql';
import { FeedArgs } from 'args/feed.args';

@ArgsType()
export class GetVehiclePositionsArgs extends FeedArgs {
  @Field({ nullable: true })
  stopId?: string;

  @Field({ nullable: true })
  currentStatus?: string;
}
