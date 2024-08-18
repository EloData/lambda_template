interface PathParameters {
  type: string;
}

interface BodyInput {
  toAddress: string[];
}

export interface ISendEmailDto {
  appName: string;
  appVersion: string;
  pathParameters: PathParameters;
  body: BodyInput;
}
