import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './src/routes/auth';
import postRouter from './src/routes/post';
import suggestRouter from './src/routes/suggest';

import { CorsConfigInterface } from './src/types';
import { errorHandler } from './src/middleware/errorHandler';

dotenv.config({ path: '../.env' });

const app = express();
const server = createServer(app);

const sessionInstance = session({
	secret: 'goorm_pro_fullstack_mission',
	resave: false,
	saveUninitialized: false,
	cookie: { path: '/', maxAge: 1000 * 60 * 60 * 60 * 24 },
});

const corsConfig: CorsConfigInterface = {
	origin: process.env.CLIENT_URL!,
	credentials: true,
};

app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sessionInstance);

app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/suggest', suggestRouter);
// 글로벌 에러 핸들러
app.use(errorHandler);

mongoose
	.connect(process.env.MONGO_URI as string)
	.then(() => console.log('Successfully connected to mongodb'))
	.catch((e: Error) => console.error(e));

server.listen(4000, () => console.log(`Server listening on port 4000`));
