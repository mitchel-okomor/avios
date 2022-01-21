"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const server_core_1 = require("./core/server.core");
const normalize_1 = require("./utils/normalize");
const port = (0, normalize_1.normalizePort)(process.env.PORT || '8000');
server_core_1.server.build().listen(port, () => console.log(`Listen on http://localhost:${port}/`));
