import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthService } from 'auth/auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor(authService: AuthService) {
    super(
      {
        header: 'x-api-key',
        prefix: '',
      },
      true,
      (apikey, done) => {
        const checkKey = authService.validateApiKey(apikey);
        if (!checkKey) {
          return done(false);
        }
        return done(true);
      },
    );
  }
}
