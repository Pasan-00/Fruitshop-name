import express, { request, response } from "express";
import {PORT,mongoDBURL} from "./config.js";
import mongoose from 'mongoose';
import { Fruit } from "./models/vmodels.js";
import fruitsRoute from './routes/fruitsRoute.js';
import cors from 'cors';

const app = express();

//Middleware for parsing request body
app.use(express.json());

//Middleware for handling CORS policy
//option 1: Aloow All Orgins with default of cors(*)
app.use(cors());
//option 2:Allow Custom Origins
// app.use(
//     cors({
//         origin: 'http://localhost:3000',
//         methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         allowedHeaders:['Content-Type']
//     })
// )



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