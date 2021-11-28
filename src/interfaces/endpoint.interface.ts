import { EntityTypes } from 'constants/';

export type EndpointTypes =
  | EntityTypes.ALERT
  | EntityTypes.TRIP_UPDATE
  | EntityTypes.VEHICLE_POSITION;

export interface IEndpoint {
  url: string;
  routes?: string[];
  alert?: boolean;
  types: EndpointTypes[];
  tripUpdate?: boolean;
  vehicle?: boolean;
}
