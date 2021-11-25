# gtfs-realtime-graphql-api

This API serves GTFS-realtime data via GraphQL. Presently, this is set up for `Alert` and `TripUpdate` data, as defined in `gtfs-realtime.proto` (Read about the GTFS Realtime specification [here](https://developers.google.com/transit/gtfs-realtime))

To serve the GTFS-static data via GraphQL see [gtfs-graphql-api](https://github.com/jurevans/gtfs-graphql-api).

## Table of Contents

- [Usage](#usage)
- [Configuring your environment](#configuring-your-environment)
- [Compiling .proto files](#compiling)
- [Running queries](#example-queries)

## Usage:

Running the dev environment:

```bash
npm run start:dev
```

You can now interact with the data at `http://localhost:5000/graphql/`.

Running the tests:

```bash
npm test
```

OR

```bash
npm run test:watch
```

## Configuring your environment

### Connect to Redis

This application uses Redis for caching, which can be configured in `.env`:

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_AUTH=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Additional environment configuration:

You will need to configure the GTFS-Realtime endpoint URLs, as well as specify the name of the access key in your `.env` config which corresponds to the value provided by the transit authority to authenticate these requests:

**NOTE**: `routes: []` is an array, or a boolean, and is only used to determine whether we should only request only a particular URL to boost performance. If this parameter is set to true, the API will query this for `TripUpdate` requests.

**NOTE**: `alert: true` will identify an endpoint as an `Alert` for fetching service-alert data. If an endpoint returns `Alert` and `TripUpdate` data, we can set `alert: true` as well as `routes: true`, and the appropriate entity types will be filtered from the response.

```javascript
const gtfsRealtime = [
  {
    feedIndex: 1,
    agencyId: 'MTA NYCT',
    feedUrls: [
      {
        routes: ['1', '2', '3', '4', '5', '6', '7'],
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
        alert: true,
        url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts',
      },
    ],
    // Name of access key to load from .env
    accessKey: 'GTFS_REALTIME_ACCESS_KEY',
  },
];
```

Using the above configuration as an example, you would need the following variable defined in a `.env` file:

```bash
GTFS_REALTIME_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**NOTE**: Each feed will have it's own `accessKey`. Having this associated with the GTFS feed configuration allows us to serve multiple feeds from this API, such as subway, metro rail, bus, and ferry.

You will need a unique access key for each group of feed endpoints you want to authenticate. In general, you may only have one configuration in here (for this example, we are configuring for the NYC MTA subway system, but we may want to add endpoints for buses as well). These are keyed by the unique `feedIndex` and `agencyId` values found in the agency table (in this example, `1` and `MTA NYCT`).

## Compiling

### Notes on .proto compiling

The `src/proto/gtfs-realtime.ts` file is generated using `protoc` and the `gtfs-realtime.proto` file (found [here](https://developers.google.com/transit/gtfs-realtime/gtfs-realtime.proto)). This file does not need to change, but notes on generating this file are below:

If you have the protobuf-compiler installed (`protoc`), and have a specific `.proto` file you wish to use in addition to `gtfs-realtime.proto`, this can be generated as follows:

From the 'proto/' directory:

```bash
npx protoc --plugin=../node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./ ./path-to-your.proto
```

`protobufjs` is required to make use of compiled protobufs, and is included in this project's `package.json`.

## Example queries

NOTE: `feedIndex` corresponds with the index established in a PostgreSQL database containing the GTFS static data. In this project, it is only used to identify which
config to utilize. A client application will likely use both the static and realtime data, and will need to know which feed to query real-time data for, and this will be identified by `feedIndex`. Otherwise, it only needs to correspond with your configuration in `config/gtfs.config.ts`. See the [gtfs-graphql-api](https://github.com/jurevans/gtfs-graphql-api) project for serving the static GTFS feeds that correspond with these real-time feeds.

Fetch `TripUpdate` data for routes `A` and `1`, for Feed with `feedIndex` = `1`:

```graphql
{
  tripUpdates(feedIndex: 1, routeIds: ["1", "A", "G"]) {
    trip {
      tripId
      routeId
      startTime
      startDate
    }
    vehicle {
      licensePlate
    }
  }
}
```

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

## TODO

Upcoming improvements to the API:

- `TripUpdate` data should be able to be queried by a time-range. This could be specified in minutes, as in specifying `minutes: 30` or `minutes: 60` in the query to say, _"give me only trips that will arrive in the next 30 or 60 minutes please!"_
- `Alert` data should allow for status queries, delays, or start and end times
- `VehiclePosition` data should be able to be queried by `currentStatus` and `stopId` to narrow focus to particular part of the feed.
- I have plans to implement a WebSocket Gateway, either in this project or in a future project. This could utilize GraphQL subscriptions such that when new feeds are requested (on an interval, perhaps specified by the client, with a rational default in place), this data is sent up to the client from the backend.
