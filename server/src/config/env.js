import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
}

export const {
  PORT,
  NODE_ENV,
  FRONTEND_URL,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  EMAIL_USER,
  EMAIL_PASS,
} = process.env;
