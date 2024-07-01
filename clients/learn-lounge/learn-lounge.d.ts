import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      accessToken?: string;
      provider?: string;
      refreshToken?: string;
      tokenExpiry?: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      name: string;
      email: string;
    };
    token?: string;
    access_token?: string;
    provider: string;
    refresh_token?: string;
    expires_in?: number;
  }
}
