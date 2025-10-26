import type { Response, NextFunction } from "express";

const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {

     if (!allowedRoles.includes(req.user.role)) {
      console.log("Role not allowed");
      return res.status(403).json({ 
        message: "Access denied", 
        yourRole: req.user.role,
        allowedRoles: allowedRoles 
      });
    }
    console.log("Role authorized");
    next();
  };
};

export default authorizeRoles;