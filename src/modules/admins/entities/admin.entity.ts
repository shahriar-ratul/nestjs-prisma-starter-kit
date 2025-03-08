import { Admin } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class AdminEntity {
  id: number;
  firstName: string | null;
  lastName: string | null;
  dob: Date | null;
  mobile: string | null;
  username: string | null;
  email: string;
  password: string;
  photo: string | null;
  joinedDate: Date;
  gender: string | null;
  lastLogin: Date | null;
  isVerified: boolean;
  verifiedAt: Date | null;
  verifiedByEmail: boolean;
  verifiedByMobile: boolean;
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
