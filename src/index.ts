import express from 'express';
import { config } from 'dotenv';
// Load environment variables from .env
config();

import mongoose from 'mongoose';
import fileupload from 'express-fileupload';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { getSecret } from './config';
import { calnedarRouter, postsRouter, userRoter } from './router';
import { errorHandlingMiddleware } from './router/helpers/ErrorHandlingMiddleware';


const app = express();
const port = 3000;

app.use(fileupload({}));
app.use(express.json());
app.use('/avatars/', express.static(path.join(__dirname + '/static')));
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: true,
	})
);
app.use('/user', userRoter);
app.use('/posts', postsRouter);
app.use('/calendar', calnedarRouter);

app.use(errorHandlingMiddleware);

mongoose.set('bufferCommands', false);

mongoose.connect(getSecret('mongodbAuth'), {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	autoIndex: true,
	dbName: 'clean'
});

app.listen(port, () => {
	console.clear();
	console.log(`Example app listening at http://localhost:${port}`);
});
