import NextAuth from "@/next-auth/server";
import CredentialsProvider from "@/next-auth/providers/credentials";

import * as Password from "@/lib/models/password";
import * as User from "@/lib/models/user";

export default NextAuth({
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
    // signIn: "/user/login",
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: "/auth/error", // Error code passed in query string as ?error=
    // newUser: "/user/register",
  },
});
