import 'reflect-metadata';
import 'express-async-errors';

import cors from 'cors';
import express from 'express';

import globalConfig from '@/config/global-config/global-config';
import { registerAppSingletons } from '@/shared/container/app-container';

import handleApplicationError from './middlewares/handle-application-error';
import appRouter from './routes/app-router';

registerAppSingletons();

const app = express();

app.use(cors({ origin: globalConfig.allowedCORSOrigins() }));
app.use(express.json());

app.use(appRouter);

app.use(handleApplicationError);

export default app;
