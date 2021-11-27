import { registerAs } from '@nestjs/config';

export default registerAs('gtfs-realtime', () => [
  {
    feedIndexes: [1],
    accessKey: 'MTA_SUBWAY_API_KEY',
    endpoints: [
      {
        tripUpdate: true,
        vehicle: true,
        routes: ['1', '2', '3', '4', '5', '6', '7', 'GS'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs',
      },
      {
        tripUpdate: true,
        vehicle: true,
        routes: ['A', 'C', 'E'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace',
      },
      {
        tripUpdate: true,
        vehicle: true,
        routes: ['B', 'D', 'F', 'M'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm',
      },
      {
        tripUpdate: true,
        vehicle: true,
        routes: ['G'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g',
      },
      {
        tripUpdate: true,
        vehicle: true,
        routes: ['J', 'Z'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz',
      },
      {
        tripUpdate: true,
        vehicle: true,
        routes: ['N', 'Q', 'R', 'W'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw',
      },
      {
        tripUpdate: true,
        vehicle: true,
        routes: ['L'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l',
      },
      {
        tripUpdate: true,
        vehicle: true,
        routes: ['SI'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-si',
      },
      {
        alert: true,
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts',
      },
    ],
  },
  {
    feedIndexes: [8, 12],
    accessKey: 'MTA_BUS_API_KEY',
    endpoints: [
      {
        tripUpdate: true,
        url: 'http://gtfsrt.prod.obanyc.com/tripUpdates',
      },
      {
        vehicle: true,
        url: 'http://gtfsrt.prod.obanyc.com/vehiclePositions',
      },
      {
        alert: true,
        url: 'http://gtfsrt.prod.obanyc.com/alerts',
      },
    ],
  },
]);
