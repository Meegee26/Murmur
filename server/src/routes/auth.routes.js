import { Router } from "express";
import {
  checkAuth,
  googleSignIn,
  requestOtp,
  signIn,
  signOut,
  signUp,
} from "../controllers/auth.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.get("/check-auth", authorize, checkAuth);
authRouter.post("/request-otp", requestOtp);
authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/google", googleSignIn);
authRouter.post("/sign-out", authorize, signOut);

export default authRouter;
