import { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { initializeDB } from "@/server/db/datasource";
import { User } from "@/server/db/entities/User";

const isSecure =
  process.env.NODE_ENV === "production" &&
  !process.env.NEXTAUTH_URL?.includes("http://localhost:3000");
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const dataSource = await initializeDB();
          const userRepo = dataSource.getRepository(User);

          const user = await userRepo
            .createQueryBuilder("user")
            .addSelect("user.passwordHash")
            .where("user.email = :email", { email: credentials.email })
            .getOne();

          if (!user) {
            return null;
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.passwordHash
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.uid);
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",

        secure: isSecure,
      },
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
