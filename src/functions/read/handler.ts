 export class ReadHandler {
  async handler(event: any, context) { 

    return {
      operation: "read",
      appName: event.appName,
      appVersion: event.appVersion || "v1",
      functionVersion: context.functionVersion,
      functionName: context.functionName,
    };
  }
}
