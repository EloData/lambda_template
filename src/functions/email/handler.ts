import { envs } from "../../core/envs";
import { ISendEmailDto } from "./dto/send-email-dto";
import { SendEmailWelcomeFactory } from "./factories/welcome.factory";

export class SendEmailHandler {
  async handler(event: ISendEmailDto, context) {
    const type = event.pathParameters.type;
    const body = JSON.parse(event.body as any);

    const welcome = new SendEmailWelcomeFactory().create();

    switch (type) {
      case "welcome":
        await welcome.execute(body);
        break;
    }

    return {
      appName: event.appName || "aws-serverless-template",
      appVersion: event.appVersion || "v1",
      functionVersion: context.functionVersion,
      functionName: context.functionName,
    };
  }
}
