import { registerAs } from '@nestjs/config';
import { EntityTypes } from 'constants/';
import { IConfig } from 'interfaces/config.interface';

export default registerAs('gtfs-realtime', (): IConfig[] => [
  /**
   * MTA Subway
   */
  {
    feeds: [1],
    accessKey: 'MTA_API_KEY',
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
  /**
   * MTA Bus
   * 2 = Bronx
   * 3 = Brooklyn
   * 4 = Manhattan
   * 5 = Queens
   * 6 = Staten Island
   */
  {
    feeds: [2, 3, 4, 5, 6],
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
  /**
   * Long Island Railroad (LIRR)
   */
  {
    feeds: [7],
    accessKey: 'MTA_API_KEY',
    endpoints: [
      {
        types: [EntityTypes.TRIP_UPDATE, EntityTypes.VEHICLE_POSITION],
        url: ' https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/lirr%2Fgtfs-lirr',
      },
      {
        types: [EntityTypes.ALERT],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Flirr-alerts',
      },
    ],
  },
  /**
   * Metro-North Railroad (MNR)
   */
  {
    feeds: [8],
    accessKey: 'MTA_API_KEY',
    endpoints: [
      {
        types: [EntityTypes.TRIP_UPDATE, EntityTypes.VEHICLE_POSITION],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/mnr%2Fgtfs-mnr',
      },
      {
        types: [EntityTypes.ALERT],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fmnr-alerts',
      },
    ],
  },
]);
