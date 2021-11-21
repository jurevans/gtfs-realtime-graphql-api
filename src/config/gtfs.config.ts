import { registerAs } from '@nestjs/config';

export default registerAs('gtfs-realtime', () => [
  {
    feedIndex: 1,
    agencyId: 'MTA NYCT',
    feedUrls: [
      {
        routes: ['1', '2', '3', '4', '5', '6', '7', 'GS'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs',
      },
      {
        routes: ['A', 'C', 'E'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace',
      },
      {
        routes: ['B', 'D', 'F', 'M'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm',
      },
      {
        routes: ['G'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g',
      },
      {
        routes: ['J', 'Z'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz',
      },
      {
        routes: ['N', 'Q', 'R', 'W'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw',
      },
      {
        routes: ['L'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l',
      },
      {
        routes: ['SI'],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-si',
      },
      {
        alert: true,
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts',
      },
    ],
    // Name of access key to load from .env
    accessKey: 'GTFS_REALTIME_ACCESS_KEY',
  },
]);
