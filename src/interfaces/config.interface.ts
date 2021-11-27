import { IEndpoint } from 'interfaces/endpoint.interface';

export interface IConfig {
  feeds: number[];
  accessKey: string;
  endpoints: IEndpoint[];
}
