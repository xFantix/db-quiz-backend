import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthUser, IGetUserAuthInfoRequest } from '../types/user';

export const verifyTokenJWT = (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, `${process.env.JWT_SECRET_KEY}`, (err, user) => {
      if (err) return res.status(403).json({ message: 'Token is not valid!' });
      req.user = user as AuthUser;
      next();
    });
  } else {
    return res.status(401).json({ message: 'You are not authenticated!' });
  }
};

export const verifyTokenAndAuthorization = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  verifyTokenJWT(req, res, () => {
    if (req.user?.id || req.user?.isAdmin) {
      next();
    } else {
      res.status(403).json({
        message: 'You are not alowed to do that!',
      });
    }
  });
};

export const verifyTokenAndAdmin = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  verifyTokenJWT(req, res, () => {
    if (req.user?.isAdmin) {
      next();
    } else {
      res.status(403).json({
        message: 'You are not alowed to do that!',
      });
    }
  });
};
