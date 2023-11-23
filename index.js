import express from 'express';
import dotenv from 'dotenv';
import DBConfig from './config/DBConfig.js';
import authRoute from './route/authRoute.js';
import taskRoute from './route/taskRoute.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRoute);
app.use('/api/', taskRoute);

const port = process.env.PORT || 2023;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
