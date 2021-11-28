# GTFS Real-Time GraphQL API

This API serves GTFS-realtime data via GraphQL for alerts, trip updates, and vehicle positions as defined in `gtfs-realtime.proto` (Read about the GTFS Realtime specification [here](https://developers.google.com/transit/gtfs-realtime)). This API is built on [NestJS](https://nestjs.com/). See the [documentation](https://docs.nestjs.com/) for more info.

To serve the corresponding GTFS-static data via GraphQL, see [gtfs-graphql-api](https://github.com/jurevans/gtfs-graphql-api).

If you would like some inspiration for building a client that consumes real-time feeds, I highly recommend the new [MTA live subway map](https://map.mta.info/).

## Table of Contents

- [Running the API](#running-the-api)
- [Testing the API](#testing-the-api)
- [Configuring your environment](#configuring-your-environment)
  - [Authentication](#authentication)
  - [Connecting to Redis](#connecting-to-redis)
  - [GTFS Real-time API Access](#gtfs-realtime-configuration)
- [Compiling .proto files](#compiling)
- [Querying the API](#querying-the-api)
  - [Trip Updates](#trip-updates)
  - [Alerts](#alerts)
  - [Vehicle Positions](#vehicle-positions)
- [TODOS](#todo)

## Running the API

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing the API

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

You can now interact with the data at `http://localhost:5000/graphql/`.

[ [Table of Contents](#table-of-contents) ]

## Configuring your environment

### Authentication

You need to defined an `API_KEYS` value in the `.env` configuration. This allows you to authenticate GraphQL requests using the `x-api-key` header. You can have any number of keys specified here, separated by a comma:

```bash
API_KEYS=1XXXXXXXXXXXXXX,2XXXXXXXXXXXXXX,3XXXXXXXXXXXXXX
```

### Connect to Redis

This application uses Redis for caching, which can be configured in `.env`:

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_AUTH=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

[ [Table of Contents](#table-of-contents) ]

### GTFS Realtime Configuration

You will need to configure the GTFS-Realtime endpoint URLs, as well as specify the name of the access key in your `.env` config (see `accessKey` below) which corresponds to the value provided by the transit authority to authenticate these requests. This key gets requested from the NestJS ConfigService. Below is an example config containing entries for MTA Subway and Bus.

**NOTES**

- **feeds** - `feeds` is an array of `feedIndex` values that correspond with a relational database (PostgreSQL/PostGIS) loaded with GTFS static data. This is how a client populated with static feed data would know where to fetch real-time updates. A configuration with its associated endpoints can be valid for multiple feeds, which is the case for MTA Buses, which have static feeds split up by borough (e.g., `bronx`, `brooklyn`, `manhattan`, `queens`, and `staten_island`, as well as the `Qxx` buses). It is absolutely acceptable to specify an arbitrary `feedIndex` that does not correspond to a GTFS static feed - the client only needs to know what is referenced in the config.
- **accessKey** - Endpoint URLs are fetched using `x-api-key` header only (with the `.env` value specified by `accessKey` below).
- **endpoints**
  - **routeIds** - If an array of `routeIds` are provided, and `routes` is defined in this config, then endpoints will be filtered by the specified matching route, otherwise, all endpoints will be returned for that endpoint type. This reduces the need to call all endpoints every time, and each URL can be cached and used individually.
  - **types** - Possible endpoint types are `tripUpdate`, `vehicle`, or `alert`. These values are enforced with the `EntityTypes` enum as seen below. This is another means by which we only request what is needed from the external APIs.
  - **url** - Simply a string containing the URL serving real-time data. These URLs and responses are cached in Redis with various TTLs depending on how often the data might update (e.g., Alerts update every minute, Vehicle Positions might update much more frequently, etc.)

```javascript
const gtfsRealtime = [
  // MTA SUBWAY
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
        types: [EntityTypes.ALERT],
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts',
      },
    ],
  },
  // Long Island Railroad (LIRR)
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
  // MTA BUSES
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
];
```

Using the above configuration as an example, you would need the following variables defined in a `.env` file:

```bash
MTA_SUBWAY_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MTA_BUS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

If you would like to use MTA real-time data, you can request access keys at the following URLs:

- [MTA Bus Time](http://bustime.mta.info/wiki/Developers/Index)
- [MTA Subway/LIRR/MNR](https://api.mta.info/#/landing)
  - _**Note**: For subway real-time data feeds, I believe that you need to create a developer account here to gain an access key._

[ [Table of Contents](#table-of-contents) ]

## Compiling

### Notes on .proto compiling

The `src/proto/gtfs-realtime.ts` file is generated using `protoc` and the `gtfs-realtime.proto` file (found [here](https://developers.google.com/transit/gtfs-realtime/gtfs-realtime.proto)). This file does not need to change, but notes on generating this file are below:

If you have the protobuf-compiler installed (`protoc`), and have a specific `.proto` file you wish to use in addition to `gtfs-realtime.proto`, this can be generated as follows:

From the 'proto/' directory:

```bash
npx protoc --plugin=../node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./ ./path-to-your.proto
```

`protobufjs` is required to make use of compiled protobufs, and is included in this project's `package.json`.

[ [Table of Contents](#table-of-contents) ]

## Querying the API

NOTE: `feedIndex` corresponds with the index established in a PostgreSQL database containing the GTFS static data. In this project, it is only used to identify which
config to utilize. A client application will likely use both the static and realtime data, and will need to know which feed to query real-time data for, and this will be identified by `feedIndex`. Otherwise, it only needs to correspond with your configuration in `config/gtfs.config.ts`. See the [gtfs-graphql-api](https://github.com/jurevans/gtfs-graphql-api) project for serving the static GTFS feeds that correspond with these real-time feeds.

### Trip Updates

Fetch `TripUpdate` data for routes `A`, `1` and `G`, for Feed with `feedIndex` = `1`, along with `stopTimeUpdate` data, which can be used by the client to determine upcoming trains (in this case) for a given stop (identified by `stopId`):

```graphql
{
  tripUpdates(feedIndex: 1, routeIds: ["1", "A", "G"]) {
    trip {
      tripId
      routeId
      startDate
    }
    stopTimeUpdate {
      stopId
      arrival {
        time
        delay
        uncertainty
      }
      departure {
        time
        delay
        uncertainty
      }
    }
  }
}
```

[ [Table of Contents](#table-of-contents) ]

### Alerts

Fetch `Alert` data for `feedIndex` = `1`:

```graphql
{
  alerts(feedIndex: 1, routeIds: ["1"]) {
    activePeriod {
      start
      end
    }
    informedEntity {
      routeId
    }
    cause
    effect
    headerText {
      translation {
        text
      }
    }
  }
}
```

[ [Table of Contents](#table-of-contents) ]

### Vehicle Positions

Fetch `VehiclePosition` data for route IDs `A` and `1`, with `feedIndex` = `1`

```graphql
{
  vehiclePositions(feedIndex: 1, routeIds: ["A"]) {
    stopId
    timestamp
    occupancyStatus
    currentStopSequence
    currentStatus
    trip {
      tripId
      routeId
      startTime
      startDate
    }
    position {
      latitude
      longitude
    }
  }
}
```

[ [Table of Contents](#table-of-contents) ]

## TODO

Upcoming improvements to the API:

- `TripUpdate` data should be able to be queried by a time-range. This could be specified in minutes, as in specifying `minutes: 30` or `minutes: 60` in the query to say, _"give me only trips that will arrive in the next 30 or 60 minutes please!"_
- `Alert` data should allow for status queries, delays, or start and end times
- `VehiclePosition` data should be able to be queried by `currentStatus` and `stopId` to narrow focus to particular part of the feed.
- I have plans to implement a WebSocket Gateway, either in this project or in a future project. This is currently implemented to some degree on [transit-app-api](https://github.com/jurevans/transit-app-api/), and the implementation can be viewed in [src/realtime/realtime.gateway.ts](https://github.com/jurevans/transit-app-api/blob/master/src/realtime/realtime.gateway.ts). A new gateway could utilize GraphQL subscriptions such that when new feeds are requested on an interval (perhaps an interval originally specified by the client, with a rational default in place), this data is sent up to the client subscriber from the backend. I will be researching this issue to find the best solution for web and mobile scenarios.
- `FeedEntity` data should respect `is_deleted` where relevant. See [the Realtime Transit specification]() on `is_deleted` (_this is low priority for now_):

```
Whether this entity is to be deleted. Should be provided only
for feeds with Incrementality of DIFFERENTIAL - this field
should NOT be provided for feeds with Incrementality of FULL_DATASET.
```

[ [Table of Contents](#table-of-contents) ]
