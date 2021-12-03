import { FeedMessage } from 'proto/gtfs-realtime';

export interface IFeedStrategy {
  getEntities: <T>(feedMessage: FeedMessage[]) => T[];
}

export class FeedMessages {
  private strategy: IFeedStrategy;

  constructor(strategy: IFeedStrategy) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: IFeedStrategy) {
    this.strategy = strategy;
  }

  public getEntities<T>(feedMessage: FeedMessage[]) {
    return this.strategy.getEntities<T>(feedMessage);
  }
}
