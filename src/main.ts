import { SendEmailHandler } from "./functions/email/handler";

const sendEmail = new SendEmailHandler().handler;

export { sendEmail };
