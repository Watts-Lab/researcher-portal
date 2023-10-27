import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
};

// see: https://next-auth.js.org/configuration/initialization#route-handlers-app
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
