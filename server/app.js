import express from "express";
import cookieParser from "cookie-parser";

import { NODE_ENV, PORT } from "./src/config/env.js";
import connectToDatabase from "./src/database/mongodb.js";
import errorMiddleware from "./src/middlewares/error.middleware.js";
import authRouter from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/user.routes.js";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.use(errorMiddleware);

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Murmur API is running on port ${PORT} in ${NODE_ENV} mode`);
});

export default app;
