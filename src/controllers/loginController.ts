// src/controllers/auth/loginController.ts
import { Request, Response, NextFunction } from "express";
import loginUser from "../services/auth/loginService";

const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
   
    const { email, password } = req.body;
    const response = await loginUser(email, password);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export default loginController;
