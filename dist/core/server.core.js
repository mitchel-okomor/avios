"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan")); // For logging functionalities
const inversify_express_utils_1 = require("inversify-express-utils");
const container_core_1 = require("./container.core");
exports.server = new inversify_express_utils_1.InversifyExpressServer(container_core_1.container);
exports.server.setConfig((app) => {
    app.use((0, morgan_1.default)('dev')); // Enable Logging
    app.use((0, cors_1.default)()); // Enable CORS from client-side
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(express_1.default.static(path_1.default.join(__dirname, '../../public/'))); // Enable assets from public folder
});
