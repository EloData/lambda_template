import { SESSendEmailCommand } from "../infra/aws/SES/send-email-command";
import { sesClient } from "../infra/aws/SES/ses-client";

export class EmailProvider {
  constructor(private readonly sesSendEmailCommand: SESSendEmailCommand) {}

  async send({ ...props }) {
    try {
      const sendEmailCommand = this.sesSendEmailCommand.execute({
        message: {
          content: props.content,
          subject: props.subject,
        },
        source: {
          fromAddress: props.fromAddress,
        },
        destination: {
          ccAddress: [],
          toAddress: props.toAddress,
        },
      });

      return await sesClient.send(sendEmailCommand);
    } catch (error) {
      console.error(error);
    }
  }
}
