// src/types.d.ts
import { IUser } from './models/User';

declare global {
  namespace Express {
    export interface User extends IUser {}
    export interface Request {
      user?: User;
    }
  }
}
