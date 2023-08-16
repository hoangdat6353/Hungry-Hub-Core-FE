import { Role } from '../enums/enums';

export interface User {
  id: string;
  username: string;
  role: Role;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  balance: number;
  status: string;
  resetPasswordToken?: string;
  lastLoggedInAt?: Date;
  salt?: string;
  passwordHash?: string;
}
