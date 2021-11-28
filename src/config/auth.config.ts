import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const { API_KEYS: apiKeysString } = process.env;
const apiKeys = apiKeysString.split(',');

export default registerAs('auth', () => ({ apiKeys }));
