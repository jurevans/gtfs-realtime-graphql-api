import { Args, Query, Resolver } from '@nestjs/graphql';
import { VehiclePositionsService } from 'vehicle-positions/vehicle-positions.service';
import { VehiclePositionEntity } from 'entities/vehicle-position.entity';
import { GetVehiclePositionsArgs } from 'vehicle-positions/vehicle-positions.args';
import { FilterVehiclePositionsArgs } from 'vehicle-positions/filter-vehicle-positions.args';

@Resolver(() => VehiclePositionEntity)
export class VehiclePositionsResolver {
  constructor(private vehiclePositionsService: VehiclePositionsService) {}

  @Query(() => [VehiclePositionEntity])
  vehiclePositions(
    @Args() getVehiclePositionsArgs: GetVehiclePositionsArgs,
    @Args() filter: FilterVehiclePositionsArgs,
  ): Promise<VehiclePositionEntity[]> {
    return this.vehiclePositionsService.getVehiclePositions(
      getVehiclePositionsArgs,
      filter,
    );
  }
}
