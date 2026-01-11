import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Caption } from "./Caption";

@Entity("Image", { schema: "public" })
export class Image {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("text", { name: "url" })
  url!: string;

  @OneToMany(() => Caption, (caption) => caption.image)
  captions!: Caption[];
}
