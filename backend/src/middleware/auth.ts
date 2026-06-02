import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const token =
    req.headers.authorization?.split(
      " "
    )[1];

  if (!token) {
    return res.status(401).json({
      message: "Token missing"
    });
  }

  try {

    const decoded: any =
      jwt.verify(
        token,
        "interview-secret"
      );

    if (
      decoded.role !== "admin"
    ) {
      return res
        .status(403)
        .json({
          message:
            "Access denied"
        });
    }

    next();

  } catch {

    return res.status(401).json({
      message: "Invalid token"
    });
  }
};