"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var DatabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const typeorm_1 = require("typeorm");
const inversify_1 = require("inversify");
const product_entity_1 = require("../entities/product.entity");
require('dotenv').config();
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbPass = process.env.DB_PASS;
const dbUser = process.env.DB_USER;
const dbDialet = process.env.DB_DIALET;
let DatabaseService = DatabaseService_1 = class DatabaseService {
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (DatabaseService_1.connection instanceof typeorm_1.Connection) {
                return DatabaseService_1.connection;
            }
            try {
                DatabaseService_1.connection = yield (0, typeorm_1.createConnection)({
                    type: dbDialet,
                    host: dbHost,
                    port: dbPort,
                    username: dbUser,
                    password: dbPass,
                    database: dbName,
                    entities: [
                        product_entity_1.Product
                    ],
                    synchronize: true,
                    logging: false
                });
                console.log("INFO", `Connection established`);
                return DatabaseService_1.connection;
            }
            catch (e) {
                console.log("ERROR", "Cannot establish database connection");
                process.exit(1);
            }
        });
    }
    getRepository(repository) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.getConnection();
            return yield connection.getCustomRepository(repository);
        });
    }
};
DatabaseService = DatabaseService_1 = __decorate([
    (0, inversify_1.injectable)()
], DatabaseService);
exports.DatabaseService = DatabaseService;
