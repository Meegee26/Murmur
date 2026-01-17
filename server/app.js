import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { app, server, initializeSocket } from "./src/lib/socket.js";
import { FRONTEND_URL, NODE_ENV, PORT } from "./src/config/env.js";
import connectToDatabase from "./src/database/mongodb.js";
import errorMiddleware from "./src/middlewares/error.middleware.js";
import authRouter from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/user.routes.js";
import chatRouter from "./src/routes/chat.routes.js";
import healthRouter from "./src/routes/health.routes.js";

initializeSocket();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chats", chatRouter);

app.use(errorMiddleware);

server.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Murmur API is running on port ${PORT} in ${NODE_ENV} mode`);
});

export default app;
