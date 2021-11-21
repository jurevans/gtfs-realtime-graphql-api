import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { VehiclePositionsService } from 'vehicle-positions/vehicle-positions.service';
import { VehiclePositionEntity } from 'entities/vehicle-position.entity';

@Resolver(() => VehiclePositionEntity)
export class VehiclePositionsResolver {
  constructor(private vehiclePositionsService: VehiclePositionsService) {}

  @Query(() => [VehiclePositionEntity])
  vehiclePositions(
    @Args('feedIndex', { type: () => Int }) feedIndex: number,
    @Args('routeIds', { type: () => [String] }) routeIds: string[],
  ): Promise<VehiclePositionEntity[]> {
    return this.vehiclePositionsService.getVehiclePositions(
      feedIndex,
      routeIds,
    );
  }
}
