import * as bodyParser from "body-parser";
import express from 'express';
import cors from 'cors';
import logger from 'morgan'; // For logging functionalities
import {InversifyExpressServer} from "inversify-express-utils";
import {container} from "./container.core";

export const server = new InversifyExpressServer(container);
server.setConfig((app)=>{
	app.use(logger('dev')); // Enable Logging
	app.use(cors()); // Enable CORS from client-side
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
})