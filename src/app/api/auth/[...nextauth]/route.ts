import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export interface GitHubProfile {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username?: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists?: number;
  total_private_repos?: number;
  owned_private_repos?: number;
  disk_usage?: number;
  suspended_at?: string | null;
  collaborators?: number;
  two_factor_authentication: boolean;
  plan?: {
    collaborators: number;
    name: string;
    space: number;
    private_repos: number;
  };
  [claim: string]: unknown;
}
//@ts-ignore
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      // profile(profile: GitHubProfile) {
      //   return {
      //     id: profile.id.toString(),
      //     name: profile.name,
      //     userName: profile.login,
      //     email: profile.email,
      //     image: profile.avatar_url,
      //   };
      // },
    }),
  ],
  callbacks: {
    //@ts-ignore
    async jwt({ token, account, profile }: { token: any, account: any, profile: any }) {
      if (account) {
        // console.log("account", account);
        token = Object.assign({}, token, {
          accessToken: account.access_token, // yes, it uses the underscore here and not camelCase
        });
      }
      if (profile) {
        token = Object.assign({}, token, {
          userName: profile.login,
        });
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session) {
        session = Object.assign({}, session, {
          accessToken: token.accessToken,
          userName: token.userName,
        });
        // console.log(session);
      }
      return session;
    },
  },
};

// see: https://next-auth.js.org/configuration/initialization#route-handlers-app
//@ts-ignore
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
