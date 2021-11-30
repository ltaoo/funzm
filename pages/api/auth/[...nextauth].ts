import NextAuth from "@/next-auth/server";
import CredentialsProvider from "@/next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import * as Password from "@/lib/models/password";
import * as User from "@/lib/models/user";
import prisma from "@/lib/client";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "邮箱",
          type: "text",
          placeholder: "example@name.com",
        },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials.password) {
          // return utils.send(400, "TODO: port over validation lib");
          return null;
        }
        // Check for existing user email
        const { email, password } = credentials;

        const user = await User.findUserByEmailService(email);
        // console.log("User.findUserByEmailService", email, user, password);
        if (!user) return null;

        const isMatch = await Password.compare(user, password);
        if (isMatch) return user;
        return null;
      },
    }),
  ],
  pages: {
    // Displays signin buttons
    signIn: "/user/login",
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: "/auth/error", // Error code passed in query string as ?error=
    // newUser: "/user/register",
  },
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true,

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },
  // jwt: {
  //   secret: process.env.SECRET,
  //   // Set to true to use encryption (default: false)
  //   encryption: false,
  // },
});
