import {Request, Response} from "express";
import {inject} from "inversify";
import {controller, httpDelete, httpGet, httpPost, httpPut, requestBody, requestParam} from "inversify-express-utils";
import {TYPES} from "../core/types.core";
import {Product, ProductRepository} from "../entities/product.entity";
import {DatabaseService} from "../services/database.service";
import uplaod from "../middlewares/multer";
import {Varieties} from "../core/types.core";
import {unlinkFile} from "../utils/files";


interface CreateProductBody{
	product_name: string;
	product_description: string;
	product_varieties: string;
}

interface UpdateProductBody{
	product_name: string;
	product_description: string;
	product_varieties: string;
}

interface MulterRequest extends Request {
    file: any;
}

@controller("/products")
export class ProductsController{
	public constructor(
		@inject(TYPES.DatabaseService) private readonly database: DatabaseService
	){}

	@httpGet("/")
	public async index(req: Request, res: Response){
		const productRepo = await this.database.getRepository(ProductRepository);
console.log("Fetching Products")
		 const products = await productRepo.find();
		 console.log("Products",  products);
		return res.status(200).json(products);
	}

	@httpGet("/:product")
	public async show(@requestParam("productId") productId: number){
		const productRepo = await this.database.getRepository(ProductRepository);
		return productRepo.findOneOrFail(productId);
	}

	@httpPost("/", uplaod.array('images'))
	public async create(
		@requestBody() body: CreateProductBody, req: Request, res: Response
	){
		console.log("body: ", req.body)
		console.log("file: ", (req as MulterRequest).file)

		const repository = await this.database.getRepository(ProductRepository);
		const product = new Product();
		const {size, color, quantity,price } = req.body
		const images = (req as MulterRequest).file?.filename;

		product.product_name = body.product_name;
		product.product_description = body.product_description;
		product.product_varieties = JSON.stringify([{size, color, quantity, images, price}]);
		repository.save(product);
		return res.sendStatus(201);
	}

	@httpPut("/:productId")
	public async update(
		@requestBody() body: UpdateProductBody, @requestParam("productId") productId: number,
		req: Request, res: Response
	){
		const repository = await this.database.getRepository(ProductRepository);
		const product = await repository.findOneOrFail(productId);
		product.product_name = body.product_name;
		product.product_description = body.product_description;
		product.product_varieties = body.product_varieties!;
		await repository.save(product);
		return res.sendStatus(204);
	}

	@httpPost("/variety/:productId", uplaod.single('images'))
	public async addVariety(
		@requestBody() body: Varieties, @requestParam("productId") productId: number,
		req: Request, res: Response
	){
		const repository = await this.database.getRepository(ProductRepository);
		const product = await repository.findOneOrFail(productId);
		const {size, color, quantity,price } = req.body
		const images = (req as MulterRequest).file?.filename;
		console.log("variety", typeof product.product_varieties)
		const parsedProduct = JSON.parse(product.product_varieties )
		product.product_varieties = JSON.stringify([...parsedProduct, {size, color, quantity, images, price}]);
		await repository.save(product);
		return res.sendStatus(204);
	}

	@httpPut("/variety/:productId/:color", uplaod.single('images'))
	public async updateVariety(
		@requestBody() body: Varieties, @requestParam("productId") productId: number, @requestParam("color") color: string,
		req: Request, res: Response
	){
		const repository = await this.database.getRepository(ProductRepository);
		const product = await repository.findOneOrFail(productId);
		const {size, quantity,price } = req.body
		const images = (req as MulterRequest).file?.filename;
		const parsedProduct = JSON.parse(product.product_varieties )
		parsedProduct.map(variant => {
			if(variant.color === color){
				if(size && size !==''){
					variant.size = size;
				};
				if(quantity && quantity !==''){
					variant.quantity = quantity;
				};
				if(price && price !==''){
					variant.price = price;
				};

			}	if(images && images !==[]){
				variant.images = images;
			}

			return variant;
		});
		product.product_varieties = JSON.stringify(parsedProduct);
		await repository.save(product);
		return res.sendStatus(204);
	}

	@httpDelete("/:productId")
	public async destroy(
		@requestParam("productId") productId: number,
		req: Request,
		res: Response
	){
		const repository = await this.database.getRepository(ProductRepository);
		const product = await repository.findOneOrFail(productId);
		await repository.delete(product);
		return res.sendStatus(204)
	}

	@httpDelete("/variety/:productId/:color")
	public async removeVariety(
		@requestParam("productId") productId: number, @requestParam("color") color: string,
		req: Request,
		res: Response
	){
		const repository = await this.database.getRepository(ProductRepository);
		const products = await repository.findOneOrFail(productId);
		const parsedProducts = JSON.parse(products.product_varieties )
const variant = parsedProducts.find(variant => variant.color === color);
const isImageDeleted = unlinkFile(variant.images)
if(isImageDeleted){
	const truncatedProducts =	parsedProducts.filter(variant => variant.color !== color);
		products.product_varieties = JSON.stringify(truncatedProducts);
		await repository.save(products);
		return res.sendStatus(204);
}
	
	}
}