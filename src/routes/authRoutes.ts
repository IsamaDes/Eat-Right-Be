
import {Router} from "express";
import registerController from "../controllers/registerController";
import loginController from "../controllers/loginController";


const router = Router();

router.post("/register", registerController);
router.post("/login", loginController)

export default router;


