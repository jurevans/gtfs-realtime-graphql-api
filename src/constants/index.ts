export enum CacheTtlSeconds {
  THIRTY_SECONDS = 30,
  ONE_MINUTE = 60,
  ONE_HOUR = 60 * 60,
  ONE_DAY = 60 * 60 * 24,
  ONE_WEEK = 7 * 24 * 60 * 60,
  FOREVER = 0,
}

export enum CacheKeyPrefix {
  VEHICLES = 'vehicles',
  TRANSFERS = 'transfers',
  ALERTS = 'alerts',
  STOPS = 'stops',
}

export enum Intervals {
  GTFS_TRIP_UPDATES = 30000,
  GTFS_ALERTS = 60000,
}

export const MAX_MINUTES = 60;
