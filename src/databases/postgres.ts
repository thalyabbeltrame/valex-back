import pg from 'pg';

import '../config/index';

const { Pool } = pg;

export const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});
