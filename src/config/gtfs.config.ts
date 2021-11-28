import { registerAs } from '@nestjs/config';
import { EntityTypes } from 'constants/';
import { IConfig } from 'interfaces/config.interface';

export default registerAs('gtfs-realtime', (): IConfig[] => [
  {
    feeds: [1],
    accessKey: 'MTA_SUBWAY_API_KEY',
    endpoints: [
      {
        types: [EntityTypes.TRIP_UPDATE, EntityTypes.VEHICLE_POSITION],
        routes: ['1', '2', '3', '4', '5', '6', '7', 'GS'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs',
      },
      {
        types: [EntityTypes.TRIP_UPDATE, EntityTypes.VEHICLE_POSITION],
        routes: ['A', 'C', 'E'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace',
      },
      {
        types: [EntityTypes.TRIP_UPDATE, EntityTypes.VEHICLE_POSITION],
        routes: ['B', 'D', 'F', 'M'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm',
      },
      {
        types: [EntityTypes.TRIP_UPDATE, EntityTypes.VEHICLE_POSITION],
        routes: ['G'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g',
      },
      {
        types: [EntityTypes.TRIP_UPDATE, EntityTypes.VEHICLE_POSITION],
        routes: ['J', 'Z'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz',
      },
      {
        types: [EntityTypes.TRIP_UPDATE, EntityTypes.VEHICLE_POSITION],
        routes: ['N', 'Q', 'R', 'W'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw',
      },
      {
        types: [EntityTypes.TRIP_UPDATE, EntityTypes.VEHICLE_POSITION],
        routes: ['L'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l',
      },
      {
        types: [EntityTypes.TRIP_UPDATE, EntityTypes.VEHICLE_POSITION],
        routes: ['SI'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-si',
      },
      {
        types: [EntityTypes.ALERT],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts',
      },
    ],
  },
  {
    feeds: [2],
    accessKey: 'MTA_SUBWAY_API_KEY',
    endpoints: [
      {
        types: [
          EntityTypes.TRIP_UPDATE,
          EntityTypes.VEHICLE_POSITION,
          EntityTypes.ALERT,
        ],
        url: ' https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/lirr%2Fgtfs-lirr',
      },
    ],
  },
  {
    feeds: [8, 12],
    accessKey: 'MTA_BUS_API_KEY',
    endpoints: [
      {
        types: [EntityTypes.TRIP_UPDATE],
        url: 'http://gtfsrt.prod.obanyc.com/tripUpdates',
      },
      {
        types: [EntityTypes.VEHICLE_POSITION],
        url: 'http://gtfsrt.prod.obanyc.com/vehiclePositions',
      },
      {
        types: [EntityTypes.ALERT],
        url: 'http://gtfsrt.prod.obanyc.com/alerts',
      },
    ],
  },
]);
