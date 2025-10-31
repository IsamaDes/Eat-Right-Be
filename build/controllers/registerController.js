"use strict";
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and returns a temporary token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *               role:
 *                 type: string
 *                 enum: [admin, nutritionist, client]
 *                 example: client
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 64f123abcde4567890ff1234
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *                 role:
 *                   type: string
 *                   example: client
 *                 token:
 *                   type: string
 *                   description: Temporary token for user session
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Missing required fields or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email and password required
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registerService_js_1 = __importDefault(require("../services/auth/registerService.js"));
const registerController = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const result = await (0, registerService_js_1.default)(name, email, password, role, res);
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: result.id,
                name: result.name,
                email: result.email,
                role: result.role,
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error.message);
        res.status(400).json({ message: error.message });
        next(error);
    }
};
exports.default = registerController;
