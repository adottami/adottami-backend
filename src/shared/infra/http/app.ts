import cors from 'cors';
import express from 'express';

import globalConfig from '@/config/global-config/global-config';

import appRouter from './routes/app-router';

const app = express();

app.use(cors({ origin: globalConfig.allowedCORSOrigins() }));
app.use(express.json());
app.use(appRouter);

export default app;
