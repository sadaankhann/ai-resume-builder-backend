import mongoose from 'mongoose';
import express from 'express';
import {connectToDB} from './config/db.js'
import cors from 'cors';

import cookieParser from 'cookie-parser';

import authSignupRoute from './routes/authSignupRoute.js';

import authLoginRoute from './routes/authLoginRoute.js';

import createResume from './routes/creatingResume.js';

import getResume from './routes/getResumes.js'

import creatingCV from './routes/creatingCV.js';

import dotenv from 'dotenv';

import { getProfileData } from '../server/routes/getData.js';

import { getProfileDataForFrontend } from '../server/routes/getData.js';

import updateCVData from './routes/updateCVData.js'

import geminiRoute from './routes/geminiRoute.js'


dotenv.config();

const app = express();

app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true             
}));

app.use(cookieParser());

app.use('/auth', authSignupRoute);

app.use('/auth', authLoginRoute);

app.use('/createresume', createResume);

app.use('/createcvformat', creatingCV);

app.use('/getresumes', getResume);

app.use('/getProfileData' , getProfileData);


app.use('/getProfileDataForFrontend', getProfileDataForFrontend);

app.use('/updateCVData', updateCVData);

app.use('/auth/login', authLoginRoute);

app.get('/', (req, res) => {
    res.send('Backend is running successfully!');
});

app.use('/geminiRoute', geminiRoute)

app.get('/login', (req,res)=>{
    if(req.cookies.token){
        window.location.href = '/';
    }
})

connectToDB();

app.listen(4000, () => {
  console.log("Server is started");
});