import mongoose from 'mongoose';
import express from 'express';
import {connectToDB} from './config/db.js'
import cors from 'cors';

import cookieParser from 'cookie-parser';

import authRoute from './routes/authRoute.js'

import getData from '../server/routes/getData.js'

import createResume from './routes/creatingResume.js';

import getResume from './routes/getResumes.js'

import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173", // <-- Apne frontend ka exact URL yahan likhein
    credentials: true                // <-- Cookies/Headers allow karne ke liye zaroori hai
}));

app.use(cookieParser());

app.use('/auth', authRoute);
app.use('/getData', getData);
app.use('/createresume', createResume);

app.use('/getresumes', getResume);

app.get('/', (req, res) => {
    res.send('Backend is running successfully!');
});

connectToDB();

app.listen(3000, () => {
  console.log("Server is started");
});