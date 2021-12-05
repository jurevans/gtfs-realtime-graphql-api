import { FeedMessage } from 'proto/gtfs-realtime';

export interface IFeedStrategy<T> {
  getEntities: (feedMessage: FeedMessage[]) => T[];
}

export class FeedMessages<T> {
  private strategy: IFeedStrategy<T>;

  constructor(strategy: IFeedStrategy<T>) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: IFeedStrategy<T>) {
    this.strategy = strategy;
  }

  public getEntities(feedMessage: FeedMessage[]): T[] {
    return this.strategy.getEntities(feedMessage);
  }
}
