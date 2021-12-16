import { ConfigService } from '@nestjs/config';
import { TripDescriptorEntity } from 'entities/trip-descriptor.entity';
import {
  EntitySelector,
  FeedEntity,
  FeedMessage,
  TranslatedString,
} from 'proto/gtfs-realtime';
import { AlertEntity } from 'entities/alert.entity';
import { EndpointTypes, IEndpoint } from 'interfaces/endpoint.interface';
import { IConfig } from 'interfaces/config.interface';

/**
 * Get GTFS config from ConfigService
 * @param configService
 * @param feedIndex
 * @returns {config}
 */
export const getGTFSConfigByFeedIndex = (
  configService: ConfigService,
  feedIndex: number,
): IConfig => {
  return configService
    .get('gtfs-realtime')
    .find((config: IConfig) => config.feeds?.indexOf(feedIndex) > -1);
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
  feedMessages: FeedMessage[],
  type: string,
): FeedEntity[] => {
  return feedMessages
    .map((feedMessage: FeedMessage) => feedMessage.entity)
    .flat()
    .filter((entity: FeedEntity) => entity.hasOwnProperty(type));
};

/**
 * Get array of URLs based on routeIds. If no routeIds provided, return all route URLs
 * @param feedUrls
 * @param routeIds
 * @returns {string[]}
 */
export const getEndpointsByRouteIds = (
  endpoints: IEndpoint[],
  routeIds: string[],
): IEndpoint[] =>
  routeIds
    ? endpoints.filter((endpoint: IEndpoint) => {
        if (routeIds.length > 0 && endpoint.hasOwnProperty('routes')) {
          if (endpoint.routes.some) {
            return endpoint.routes.some(
              (route: string) => routeIds.indexOf(route) > -1,
            );
          }
          return false;
        }
        return true;
      })
    : endpoints;

/**
 * Get array of URLs for service alerts
 * @param endpoints
 * @returns {string[]}
 */
export const getUrlsByType = (
  endpoints: IEndpoint[],
  type: EndpointTypes,
): string[] =>
  endpoints
    .filter((endpoint: IEndpoint) =>
      endpoint.types.some(
        (endpointType: EndpointTypes) => endpointType === type,
      ),
    )
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
      routeIds.some((routeId: string) => routeId === entity.trip?.routeId),
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
