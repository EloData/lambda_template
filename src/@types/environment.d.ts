declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_NAME: string;
      APP_VERSION: string;
    }
  }
}

export {};
