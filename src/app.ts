import express, { json, Express } from 'express';
import 'express-async-errors';
import cors from 'cors';

import { router } from './routers/index';
import { errorHandler } from './middlewares/errorHandlerMiddleware';

export const app: Express = express();
app.use(json());
app.use(cors());
app.use(router);
app.use(errorHandler);
