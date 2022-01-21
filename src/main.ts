import "reflect-metadata";
import {container} from "./core/container.core";
import {server} from "./core/server.core";
import {TYPES} from "./core/types.core";
import { normalizePort} from './utils/normalize';

const port = normalizePort(process.env.PORT || '8000');
server.build().listen(port, ()=> console.log(`Listen on http://localhost:${port}/`))