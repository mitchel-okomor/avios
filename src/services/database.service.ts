import {Any, Connection, createConnection, ObjectType} from "typeorm";
import {inject, injectable} from 'inversify'
import {TYPES} from '../core/types.core'
import {Logger} from '../services/logger.service'
import { Product } from "../entities/product.entity";

require('dotenv').config();
const dbName:any = process.env.DB_NAME
const dbHost:any = process.env.DB_HOST
const dbPort:any = process.env.DB_PORT
const dbPass:any = process.env.DB_PASS
const dbUser:any = process.env.DB_USER
const dbDialet:any = process.env.DB_DIALET



@injectable()
export class DatabaseService{
private static connection: Connection;

public async getConnection(): Promise<Connection> {
	if(DatabaseService.connection instanceof Connection){
		return DatabaseService.connection;
	}

	try{
		DatabaseService.connection = await createConnection({
			type: dbDialet,
			host: dbHost,
			port: dbPort,
			username: dbUser,
			password: dbPass,
			database: dbName,
			entities: [
				Product
			],
			synchronize: true,
			logging: false
		});
		console.log("INFO", `Connection established`);
		return DatabaseService.connection;
	}catch(e){
		console.log("ERROR", "Cannot establish database connection");
		process.exit(1);
	}
}

public async getRepository<T>(repository: ObjectType<T>):Promise<T>{
const connection = await this.getConnection();
return await connection.getCustomRepository<T>(repository)
}

}