// import {MailtrapClient} from "mailtrap";
// import dotenv from "dotenv";

// dotenv.config();
 
// export const client = new MailtrapClient({token: process.env.MAILTRAP_API_TOKEN! });

// export const sender = {
//   email: "mailtrap@demomailtrap.com",
//   name: "La vire pizza",
// };
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const brevoClient = axios.create({
  baseURL: "https://api.brevo.com/v3",
  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.BREVO_API_KEY, // Store your Brevo API Key in .env
  },
});

export const sender = {
  email: "singhvishal6203650586@gmail.com", // Your Brevo sender email
  name: "La Vire Pizza",
};
