import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { getAccessTokenByRefreshToken } from "./actions/token";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // If token hasn't expired, return token directly as we don't need to update the token properties
      if (token.expires_in && Date.now() < token.expires_in) {
        return token;
      }

      // If access token has expired, request a new access token using the refresh token
      if (
        token.expires_in &&
        token.refresh_token &&
        token.expires_in < Date.now()
      ) {
        const refreshTokenData = await getAccessTokenByRefreshToken(
          token.refresh_token,
          token.provider
        );

        // Update the token properties
        token.access_token = refreshTokenData.access_token;
        token.expires_in = refreshTokenData.expires_in * 1000 + Date.now();

        return token;
      }

      if (user) {
        // If user exists, append the user details in the token
        token = { ...token, ...user };
      }

      // For credentials provider, convert the expires_in property in milliseconds
      if (token.expires_in && token.provider === "credentials") {
        token.expires_in = token.expires_in * 1000 + Date.now();
      }

      // For other providers, update the token properties
      if (account?.access_token) {
        token.access_token = account.access_token;
        token.provider = account.provider;
        token.expires_in = account.expires_in! * 1000 + Date.now();
        token.refresh_token = account.refresh_token;
      }

      return token;
    },
    async session({ token, session }) {
      // Extend the user data in the session
      if (token.user && session.user) {
        session.user.id = token.user.id;
        session.user.name = token.user.name;
        session.user.email = token.user.email;
      }

      if (token.access_token && session.user) {
        session.user.accessToken = token.access_token;
        session.user.provider = token.provider;
        session.user.tokenExpiry = token.expires_in;
        session.user.refreshToken = token.refresh_token;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },

  ...authConfig,
});
