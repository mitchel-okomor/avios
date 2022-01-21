"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const types_core_1 = require("../core/types.core");
const product_entity_1 = require("../entities/product.entity");
const database_service_1 = require("../services/database.service");
const multer_1 = __importDefault(require("../middlewares/multer"));
const files_1 = require("../utils/files");
const express_validator_1 = require("express-validator");
let ProductsController = class ProductsController {
    constructor(database) {
        this.database = database;
    }
    //Get all products
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productRepo = yield this.database.getRepository(product_entity_1.ProductRepository);
            console.log("Fetching Products");
            const products = yield productRepo.find();
            console.log("Products", products);
            return res.status(200).json(products);
        });
    }
    //Get a single product
    show(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const productRepo = yield this.database.getRepository(product_entity_1.ProductRepository);
            return productRepo.findOneOrFail(productId);
        });
    }
    //Create a product
    create(body, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, express_validator_1.body)('product_name').isLength({ min: 3 });
            (0, express_validator_1.body)('product_discription').isLength({ min: 3 });
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const repository = yield this.database.getRepository(product_entity_1.ProductRepository);
            const product = new product_entity_1.Product();
            const { size, color, quantity, price } = req.body;
            const images = req.files;
            //get only the image name
            const imagesURL = images.map((item) => {
                return item.filename;
            });
            product.product_name = body.product_name;
            product.product_description = body.product_description;
            product.product_varieties = JSON.stringify([{ size, color, quantity, images: imagesURL, price }]);
            repository.save(product);
            return res.sendStatus(201).json(product);
        });
    }
    //update a product
    update(body, productId, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = yield this.database.getRepository(product_entity_1.ProductRepository);
            const product = yield repository.findOneOrFail(productId);
            product.product_name = body.product_name;
            product.product_description = body.product_description;
            product.product_varieties = body.product_varieties;
            yield repository.save(product);
            return res.sendStatus(204).json(product);
        });
    }
    //create a variety on a product
    addVariety(body, productId, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = yield this.database.getRepository(product_entity_1.ProductRepository);
            const product = yield repository.findOneOrFail(productId);
            const { size, color, quantity, price } = req.body;
            const images = req.files;
            console.log("variety", typeof product.product_varieties);
            const parsedProduct = JSON.parse(product.product_varieties);
            product.product_varieties = JSON.stringify([...parsedProduct, { size, color, quantity, images, price }]);
            yield repository.save(product);
            return res.sendStatus(204).json(product);
        });
    }
    //Edit a veriety 
    updateVariety(body, productId, color, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = yield this.database.getRepository(product_entity_1.ProductRepository);
            const product = yield repository.findOneOrFail(productId);
            const { size, quantity, price } = req.body;
            const parsedProduct = JSON.parse(product.product_varieties);
            parsedProduct.map(variant => {
                if (variant.color === color) {
                    if (size && size !== '') {
                        variant.size = size;
                    }
                    ;
                    if (quantity && quantity !== '') {
                        variant.quantity = quantity;
                    }
                    ;
                    if (price && price !== '') {
                        variant.price = price;
                    }
                    ;
                }
                return variant;
            });
            product.product_varieties = JSON.stringify(parsedProduct);
            yield repository.save(product);
            return res.sendStatus(204).json(product);
        });
    }
    //Delete a product
    destroy(productId, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = yield this.database.getRepository(product_entity_1.ProductRepository);
            const product = yield repository.findOneOrFail(productId);
            yield repository.delete(product);
            return res.sendStatus(204);
        });
    }
    removeVariety(productId, color, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = yield this.database.getRepository(product_entity_1.ProductRepository);
            const products = yield repository.findOneOrFail(productId);
            const parsedProducts = JSON.parse(products.product_varieties);
            const variant = parsedProducts.find(variant => variant.color === color);
            const isImageDeleted = (0, files_1.unlinkFile)(variant.images);
            if (isImageDeleted) {
                const truncatedProducts = parsedProducts.filter(variant => variant.color !== color);
                products.product_varieties = JSON.stringify(truncatedProducts);
                yield repository.save(products);
                return res.sendStatus(204);
            }
        });
    }
};
__decorate([
    (0, inversify_express_utils_1.httpGet)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "index", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/:product"),
    __param(0, (0, inversify_express_utils_1.requestParam)("productId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "show", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)("/", multer_1.default.array('images')),
    __param(0, (0, inversify_express_utils_1.requestBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, inversify_express_utils_1.httpPut)("/:productId"),
    __param(0, (0, inversify_express_utils_1.requestBody)()),
    __param(1, (0, inversify_express_utils_1.requestParam)("productId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)("/variety/:productId", multer_1.default.array('images')),
    __param(0, (0, inversify_express_utils_1.requestBody)()),
    __param(1, (0, inversify_express_utils_1.requestParam)("productId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "addVariety", null);
__decorate([
    (0, inversify_express_utils_1.httpPut)("/variety/:productId/:color", multer_1.default.single('images')),
    __param(0, (0, inversify_express_utils_1.requestBody)()),
    __param(1, (0, inversify_express_utils_1.requestParam)("productId")),
    __param(2, (0, inversify_express_utils_1.requestParam)("color")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateVariety", null);
__decorate([
    (0, inversify_express_utils_1.httpDelete)("/:productId"),
    __param(0, (0, inversify_express_utils_1.requestParam)("productId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "destroy", null);
__decorate([
    (0, inversify_express_utils_1.httpDelete)("/variety/:productId/:color"),
    __param(0, (0, inversify_express_utils_1.requestParam)("productId")),
    __param(1, (0, inversify_express_utils_1.requestParam)("color")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "removeVariety", null);
ProductsController = __decorate([
    (0, inversify_express_utils_1.controller)("/products"),
    __param(0, (0, inversify_1.inject)(types_core_1.TYPES.DatabaseService)),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ProductsController);
exports.ProductsController = ProductsController;
