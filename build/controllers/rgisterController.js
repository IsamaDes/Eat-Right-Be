"use strict";
const express = require("express");
const registerUser = require("../services/auth/registerService");
const router = express.Router();
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
router.post("/", async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const response = await registerUser(name, email, password);
        res.status(201).json(response);
    }
    catch (err) {
        next(err);
    }
});
module.exports = router;
