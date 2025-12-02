import { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import AppDataSource from "@/server/db/datasource";
import { User } from "@/server/db/entities/User";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: { email: {}, password: {} },
      async authorize(c) {
        if (!c?.email || !c?.password) return null;
        if (!AppDataSource.isInitialized) await AppDataSource.initialize();
        const repo = AppDataSource.getRepository(User);
        const u = await repo
          .createQueryBuilder("u")
          .addSelect("u.passwordHash")
          .where("u.email = :email", { email: c.email })
          .getOne();
        if (!u) return null;
        if (!(await compare(String(c.password), u.passwordHash))) return null;
        return {
          id: u.id,
          email: u.email,
          name: u.name,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = (user as any).id;
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
  secret: process.env.NEXTAUTH_SECRET,
};
