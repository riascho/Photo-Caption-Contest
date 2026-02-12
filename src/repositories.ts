import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Caption } from "./entity/Caption";
import { Image } from "./entity/Image";
import { Repository } from "typeorm";

let imageRepository: Repository<Image>;
let userRepository: Repository<User>;
let captionRepository: Repository<Caption>;

export function initializeRepositories(dataSource: DataSource): void {
  imageRepository = dataSource.getRepository(Image);
  userRepository = dataSource.getRepository(User);
  captionRepository = dataSource.getRepository(Caption);
}

export { imageRepository, userRepository, captionRepository };
