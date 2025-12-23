import express, { request, response } from "express";
import {PORT,mongoDBURL} from "./config.js";
import mongoose from 'mongoose';
import { Fruit } from "./models/vmodels.js";
import fruitsRoute from './routes/fruitsRoute.js';
import cors from 'cors';

const app = express();

//Middleware for parsing request body with increased size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());


app.use('/fruits',fruitsRoute);

mongoose 
    .connect(mongoDBURL)
    .then(() =>{
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listen to port: ${PORT}`);
        });

    })
    .catch((error) =>{
        console.log(error);

    });