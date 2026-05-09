import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/db";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // Normalise email — trims whitespace & lowercases so Android
                // auto-capitalise doesn't cause false "invalid password" errors
                const email = credentials.email.trim().toLowerCase();

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user || !user.password) return null;

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isValid) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    handle: user.handle,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.handle = token.handle;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.handle = user.handle;
            }
            return token;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
});
