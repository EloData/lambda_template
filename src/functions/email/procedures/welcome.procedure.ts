import { EmailProvider } from "../../../core/providers/email-provider";
import { EmailTemplateManager } from "../../../core/helpers/email-template-manager.helper";
import { EmailCreator } from "../../../core/infra/email-creator";
import { envs } from "../../../core/envs";

export class SendEmailWelcomeProcedure extends EmailCreator {
  constructor(
    emailProvider: EmailProvider,
    emailTemplateManager: EmailTemplateManager
  ) {
    super(emailProvider, emailTemplateManager);
  }

  async execute(input: any) {
    return await this.send({}, { toAddress: input.toAddress });
  }

  protected setEmailInfo() {
    return {
      subject: "Boas vindas",
      fromAddress: envs.FROM_ADDRESS,
    };
  }
}
