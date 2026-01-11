import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Image } from "./Image";
import { User } from "./User";

@Entity("Caption", { schema: "public" })
export class Caption {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("text", { name: "text" })
  text!: string;

  @ManyToOne(() => Image, (image) => image.captions, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "imageId", referencedColumnName: "id" }])
  image!: Image;

  @ManyToOne(() => User, (user) => user.captions, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
  user!: User;
}
