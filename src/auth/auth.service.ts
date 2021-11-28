import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  validateApiKey(apiKey: string): Promise<string> {
    const { apiKeys } = this.configService.get('auth');
    return apiKeys.find((key: string) => apiKey === key);
  }
}
