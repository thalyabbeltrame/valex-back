import express, { json, Express } from 'express';
import cors from 'cors';

import router from './routers/index';

const app: Express = express();
app.use(json());
app.use(cors());
app.use(router);

export default app;
