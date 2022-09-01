import { config as dotenvConfig } from 'dotenv';

const path = process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env';

dotenvConfig({ path });
