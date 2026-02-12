import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Caption } from "./Caption";

@Index("User_email_key", ["email"], { unique: true })
@Index("User_userName_key", ["userName"], { unique: true })
@Entity("User", { schema: "public" })
export class User {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("text", { name: "email", unique: true, select: false })
  email!: string;

  @Column("text", { name: "password", select: false })
  password!: string;

  @Column("text", { name: "userName", unique: true })
  userName!: string;

  @OneToMany(() => Caption, (caption) => caption.user)
  captions!: Caption[];
}
