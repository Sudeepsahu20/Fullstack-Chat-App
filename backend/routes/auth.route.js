import express from 'express';
import { checkAuth, signup, updateProfile } from '../controllers/auth.controller.js';
import { login } from '../controllers/auth.controller.js';
import { logout } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.protectRoute.js';


const router=express.Router();

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)

router.put("/update-profile",protectRoute,updateProfile);

router.get("/check",protectRoute,checkAuth);

export default router;