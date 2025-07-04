import type { NextFunction, Request, Response } from "express";
import { type JwtPayload, verify } from "jsonwebtoken";

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) : void => {
  const headers = req.headers.authorization;

  if (!headers) {
     res.status(401).json({
      message: "No Authorization Header Found",
    });
    return;
  }

  const token = headers.split(" ")[1];

  if (!token) {
     res.status(401).json({
      message: "Auth Token Not Found!",
    });
    return;
  }

  try {
    const isVerified = verify(token, process.env.JWT_SECRET ?? "") as JwtPayload;

    if (!isVerified || !isVerified.sub) {
       res.status(403).json({
        message: "Unauthorized User",
      });
      return;
    }

    req.userId = isVerified.sub;
    next();
  } catch (error) {
     res.status(403).json({
      message: "Invalid or Expired Token",
    });
    return;
  }
};