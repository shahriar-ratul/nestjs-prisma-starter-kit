import { Customer } from "@prisma/client";
import { Exclude } from "class-transformer";

export class UserEntity implements Customer {
  id: number;
  firstName: string;
  lastName: string;
  dob: Date;
  mobile: string;
  email: string;
  password: string;
  photo: string | null;
  joinedAt: Date;
  lastLogin: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  deleted: boolean;
  @Exclude()
  deletedBy: number | null;
  @Exclude()
  deletedAt: Date | null;
}
