import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { sendMessage } from "../controllers/message.controller.js";
import {
  createChat,
  getSingleChat,
  getUserChats,
  markChatAsRead,
} from "../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.post("/create", authorize, createChat);
chatRouter.post("/message/send", authorize, sendMessage);
chatRouter.get("/all", authorize, getUserChats);
chatRouter.get("/:id", authorize, getSingleChat);
chatRouter.patch("/:id/read", authorize, markChatAsRead);

export default chatRouter;
