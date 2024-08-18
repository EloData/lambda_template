import { EmailProvider } from "../../../core/providers/email-provider";
import { SendEmailWelcomeProcedure } from "../procedures/welcome.procedure";
import { WelcomeEmailTemplate } from "../templates/welcome/template.creator";
import { SESSendEmailCommand } from "../../../core/infra/aws/SES/send-email-command";

export class SendEmailWelcomeFactory {
  create(): SendEmailWelcomeProcedure {
    const sesSendEmailCommand = new SESSendEmailCommand();
    const emailProvider = new EmailProvider(sesSendEmailCommand);
    const welcomeEmailTemplate = new WelcomeEmailTemplate();

    return new SendEmailWelcomeProcedure(emailProvider, welcomeEmailTemplate);
  }
}
