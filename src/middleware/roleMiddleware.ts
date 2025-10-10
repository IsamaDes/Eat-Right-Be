import type { Request, Response, NextFunction } from "express";

const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = authorizeRoles;