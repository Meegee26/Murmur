import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "./env.js";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

export default googleClient;
