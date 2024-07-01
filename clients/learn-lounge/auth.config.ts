import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: { params: { prompt: "consent", expires_in: "120" } },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
    Credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Import Auth handler app's server url from environment variables
        const authHandlerAppServerUrl =
          process.env.NEXT_PUBLIC_AUTH_HANDLER_APP_SERVER_URL;
        const response = await fetch(
          `${authHandlerAppServerUrl}/api/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ credentials }),
            next: {
              tags: ["user"],
            },
          }
        );

        const userDetails = await response.json();
        return userDetails;
      },
    }),
  ],
} satisfies NextAuthConfig;
