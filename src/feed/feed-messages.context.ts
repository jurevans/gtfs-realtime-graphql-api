import { FeedMessage } from 'proto/gtfs-realtime';

export type IFeedStrategy<T> = (feedMessage: FeedMessage[]) => T[];

export class FeedMessages<T> {
  private strategy: IFeedStrategy<T>;

  constructor(strategy: IFeedStrategy<T>) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: IFeedStrategy<T>) {
    this.strategy = strategy;
  }

  public getEntities(feedMessages: FeedMessage[]): T[] {
    return this.strategy(feedMessages);
  }
}
