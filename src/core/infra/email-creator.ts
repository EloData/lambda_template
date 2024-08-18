import { EmailTemplateManager } from "../../core/helpers/email-template-manager.helper";
import { EmailProvider } from "../providers/email-provider";

export abstract class EmailCreator {
  private emailProvider: EmailProvider;
  private emailTemplateManager: EmailTemplateManager;

  constructor(
    emailProvider: EmailProvider,
    emailTemplateManager: EmailTemplateManager
  ) {
    this.emailProvider = emailProvider;
    this.emailTemplateManager = emailTemplateManager;
  }

  async send(
    templateParams: any,
    emailParams: {
      toAddress: string[];
    }
  ) {
    const content = this.emailTemplateManager.get(templateParams);
    const emailInfo = this.setEmailInfo();

    await this.emailProvider.send({
      content,
      ...emailInfo,
      ...emailParams,
    });
  }

  protected abstract setEmailInfo(): { fromAddress: string, subject: string };
}
