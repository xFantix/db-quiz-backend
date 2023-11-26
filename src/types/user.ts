import { Request } from 'express';
export interface RegisterUser {
  name: string;
  surname: string;
  password: string;
  email: string;
  index_umk: number;
  isAdmin?: boolean;
  groupId?: number;
}

export interface RegisterUserCSV {
  name: string;
  surname: string;
  email: string;
  index_umk: string;
  isAdmin?: boolean;
  groupId: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface RefreshToken {
  token: string;
}

export interface AuthUser {
  id?: string;
  isAdmin?: boolean;
}

export interface IGetUserAuthInfoRequest extends Request {
  user?: AuthUser;
}
