declare module 'express-session' {
  interface SessionData {
    siwe: Record<any, any> | undefined;
    nonce: string | undefined;
  }
}

export {};
