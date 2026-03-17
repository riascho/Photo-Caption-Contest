import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Caption } from "./entity/Caption";
import { Image } from "./entity/Image";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'production',
  entities: [User, Caption, Image],
  migrations: [],
  subscribers: [],
});
