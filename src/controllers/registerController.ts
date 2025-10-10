import express from "express";
import registerUser from "../services/auth/registerService";
import { Request, Response, NextFunction } from "express";



/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Missing fields
 *       409:
 *         description: User already exists
 */
const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const { name, email, password, role } = req.body;
    if(!name || !email || !password || !role)       
     return res.status(400).json({ message: "All fields are required" });

    const response = await registerUser(name, email, password, role);
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export default registerController;
