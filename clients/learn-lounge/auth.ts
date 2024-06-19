import NextAuth from "next-auth";
import authConfig from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token = { ...token, ...user };
      }
      if (account?.access_token) {
        token.access_token = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ token, session}) {
      if (token.user && session.user) {
        session.user.id = token.user.id;
        session.user.name = token.user.name;
        session.user.email = token.user.email;
        session.user.jwt = token.token
      }

      if(token.access_token && session.user){
        session.user.accessToken = token.access_token;
        session.user.provider = token.provider;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },

  ...authConfig,
});
