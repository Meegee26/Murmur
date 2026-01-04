import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { sendMessage } from "../controllers/message.controller.js";

const chatRouter = Router();

chatRouter.post("/create", authorize);
chatRouter.post("/message/send", authorize, sendMessage);
chatRouter.post("/all", authorize);
chatRouter.post("/:id", authorize);

export default chatRouter;
