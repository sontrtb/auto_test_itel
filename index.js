import dotenv from 'dotenv';
dotenv.config();

import { db } from './db/config/database.connection.js';
import {run} from "./actions/run.js"

import cron from 'node-cron';

await db.connect();

run();

cron.schedule('*/15 * * * *', run);