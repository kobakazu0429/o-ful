import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { firebaseAdmin } from "../../../lib/firebaseAdmin";

export default NextAuth({
  providers: [
    // @ts-expect-error
    CredentialsProvider({
      authorize: async (credentials, _req) => {
        // @ts-expect-error
        const { idToken } = credentials;
        if (idToken) {
          try {
            const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
            return { ...decoded };
          } catch (error) {
            console.log("Failed to verify ID token:", error);
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      // console.log("[jwt]: ", { token, user });

      if (user) {
        token = user;
      }
      return token;
    },
    async session({ session, token }) {
      // console.log("[session]: ", { session, token });

      // @ts-expect-error
      session.user.uid = token.uid;
      return session;
    },
  },
});
