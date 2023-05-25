import "reflect-metadata";
import 'dotenv/config';
import 'shared/container';
import 'express-async-errors';

import express from 'express';

import cors from 'cors';
import { routes } from './routes';

import { errors as errorsCelebrate } from 'celebrate';
import { handlerError } from './middlewares/handlerError';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(errorsCelebrate());
app.use(handlerError);

app.listen(8080, () =>
    console.log('server is running in http://localhost:8080'),
);
