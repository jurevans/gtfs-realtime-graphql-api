import { ConfigService } from '@nestjs/config';
import { TripDescriptorEntity } from 'entities/trip-descriptor.entity';
import { IEndpoint } from 'interfaces/endpoint.interface';
import {
  EntitySelector,
  FeedEntity,
  FeedMessage,
  TranslatedString,
} from 'proto/gtfs-realtime';
import { AlertEntity } from 'entities/alert.entity';

/**
 * Get config from ConfigService
 * @param configService
 * @param configKey
 * @param feedIndex
 * @returns {config}
 */
export const getConfigByFeedIndex: any = (
  configService: ConfigService,
  configKey: string,
  feedIndex: number,
) => {
  return configService
    .get(configKey)
    .find((config: any) => config.feedIndex === feedIndex);
};

/**
 * Return translated text from Alerts
 * @param translated
 * @param language
 * @returns {string}
 */
export const getAlertTranslationText = (
  translated: TranslatedString,
  language: string,
): string => {
  const { translation } = translated;
  const textTranslation = translation.find(
    (translation: any) => translation.language === language,
  );
  if (textTranslation) {
    const { text } = textTranslation;
    return text;
  }
  return '';
};

/**
 * Return FeedEntities specified by type
 * @param feedMessage
 * @param type
 * @returns {FeedEntity[]}
 */
export const getFeedEntitiesByType = (
  feedMessage: FeedMessage,
  type: string,
): FeedEntity[] => {
  return feedMessage.entity.filter((entity: FeedEntity) =>
    entity.hasOwnProperty(type),
  );
};

/**
 * Get array of URLs based on routeIds. If no routeIds provided, return all route URLs
 * @param feedUrls
 * @param routeIds
 * @returns {string[]}
 */
export const getUrlsByRouteIds = (
  feedUrls: IEndpoint[],
  routeIds: string[],
): string[] => {
  const endpoints = routeIds
    ? feedUrls.filter((endpoint: IEndpoint) => {
        if (routeIds.length > 0 && endpoint.hasOwnProperty('routes')) {
          if (endpoint.routes.some) {
            return endpoint.routes.some(
              (route: string) => routeIds.indexOf(route) > -1,
            );
          }
          return false;
        }
        return !!endpoint.routes;
      })
    : feedUrls;

  return endpoints.map((endpoint: IEndpoint) => endpoint.url);
};

/**
 * Get array of URLs for service alerts
 * @param feedUrls
 * @returns {string[]}
 */
export const getAlertUrls = (feedUrls: IEndpoint[]): string[] =>
  feedUrls
    .filter((endpoint: IEndpoint) => endpoint.alert === true)
    .map((endpoint: IEndpoint) => endpoint.url);

/**
 * Filter entities array by array of routeIds
 * @param entities
 * @param routeIds
 * @param type
 * @returns {T[]}
 */
export const filterTripEntitiesByRouteIds = <T>(
  entities: T[],
  routeIds: string[],
): T[] =>
  <T[]>(
    entities.filter((entity: T & { trip: TripDescriptorEntity }) =>
      routeIds.some((routeId: string) => routeId === entity.trip.routeId),
    )
  );

/**
 * Filter alert entities by array of routeIds
 * @param entities
 * @param routeIds
 * @returns {AlertEntity[]}
 */
export const filterAlertsByRouteIds = (
  entities: AlertEntity[],
  routeIds: string[],
) => <AlertEntity[]>entities.filter((entity: AlertEntity) => {
    const { informedEntity } = entity;
    const entities = informedEntity.filter((entity: EntitySelector) =>
      routeIds.some((routeId: string) => routeId === entity.routeId),
    );
    return entities.length > 0;
  });
