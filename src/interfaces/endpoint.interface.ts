export interface IEndpoint {
  url: string;
  routes?: string[];
  alert?: boolean;
  tripUpdate?: boolean;
  vehicle?: boolean;
}
