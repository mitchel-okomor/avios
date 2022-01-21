import {Any, Connection, createConnection, ObjectType} from "typeorm";
import {inject, injectable} from 'inversify'
import {TYPES} from '../core/types.core'
import {Logger} from '../services/logger.service'
import { Product } from "../entities/product.entity";

require('dotenv').config();


@injectable()
export class DatabaseService{
private static connection: Connection;

public async getConnection(): Promise<Connection> {
	if(DatabaseService.connection instanceof Connection){
		return DatabaseService.connection;
	}

	try{
		DatabaseService.connection = await createConnection({
			type: "mysql",
			host: "localhost",
			port: 3306,
			username: "root",
			password: "password",
			database: "avios",
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