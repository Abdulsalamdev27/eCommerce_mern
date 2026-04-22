import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router()

router.get("/", protectRoute, adminRoute,  async (req, res)=>{

})


export default router