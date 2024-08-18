import { SendEmailCommand } from "@aws-sdk/client-ses";

interface Input {
  message: {
    content: string;
    subject: string;
  };
  source: {
    fromAddress: string;
  };
  destination: {
    ccAddress: string[];
    toAddress: string[];
  };
}

export class SESSendEmailCommand {
  execute(props: Input) {
    const { destination, message, source } = props;

    const destinationConfig = {
      CcAddresses: destination.ccAddress,
      ToAddresses: destination.toAddress,
    };

    const emailBodyConfig = {
      Html: {
        Charset: "UTF-8",
        Data: message.content,
      },
    };

    const emailSubjectConfig = {
      Charset: "UTF-8",
      Data: message.subject,
    };

    return new SendEmailCommand({
      Destination: destinationConfig,
      Message: {
        Body: emailBodyConfig,
        Subject: emailSubjectConfig,
      },
      Source: source.fromAddress,
    });
  }
}
