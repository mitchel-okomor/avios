import {Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository, CreateDateColumn, UpdateDateColumn} from "typeorm";
import {Varieties} from '../core/types.core'

@Entity()
export class Product{
@PrimaryGeneratedColumn()
id: number;

@Column({unique: true})
product_name: string;

@Column()
product_description: string;

@Column("simple-json")
product_varieties:string;

@CreateDateColumn()
date_uploaded: Date;

@UpdateDateColumn()
date_edited: Date;

}

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {}