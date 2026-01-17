import sgMail from "@sendgrid/mail";
import { SENDGRID_API_KEY } from "./env.js";

const sendGrid = sgMail.setApiKey(SENDGRID_API_KEY);

export default sendGrid;
