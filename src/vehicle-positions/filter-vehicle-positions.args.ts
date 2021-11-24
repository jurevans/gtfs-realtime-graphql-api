import { ArgsType } from '@nestjs/graphql';
import { FilterRoutesArgs } from 'args/filter-routes.args';

@ArgsType()
export class FilterVehiclePositionsArgs extends FilterRoutesArgs {}
