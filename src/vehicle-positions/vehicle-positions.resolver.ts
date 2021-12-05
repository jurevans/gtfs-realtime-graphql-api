import { Args, Query, Resolver } from '@nestjs/graphql';
import { VehiclePositionsService } from 'vehicle-positions/vehicle-positions.service';
import { VehiclePositionEntity } from 'entities/vehicle-position.entity';
import {
  GetVehiclePositionsArgs,
  FilterVehiclePositionsArgs,
} from 'vehicle-positions/vehicle-positions.args';

@Resolver(() => VehiclePositionEntity)
export class VehiclePositionsResolver {
  constructor(private vehiclePositionsService: VehiclePositionsService) {}

  @Query(() => [VehiclePositionEntity], { name: 'vehiclePositions' })
  getVehiclePositions(
    @Args() getVehiclePositionsArgs: GetVehiclePositionsArgs,
    @Args() filter: FilterVehiclePositionsArgs,
  ): Promise<VehiclePositionEntity[]> {
    return this.vehiclePositionsService.getVehiclePositions(
      getVehiclePositionsArgs,
      filter,
    );
  }
}
