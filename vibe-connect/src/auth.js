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

                try {
                    const email = credentials.email.trim().toLowerCase();

                    let user = await prisma.user.findUnique({
                        where: { email },
                    });

                    // Auto-provision demo account on-demand if missing in database
                    if (!user && email === "demo@vibeconnect.com") {
                        const hashedPassword = await bcrypt.hash("vibemaster99", 10);
                        user = await prisma.user.create({
                            data: {
                                email: "demo@vibeconnect.com",
                                name: "Nova Echo (Demo)",
                                handle: "@nova_echo",
                                password: hashedPassword,
                                bio: "Exploring the 3D spatial vibe continuum 🌌✨",
                                vibeTag: "Ethereal Cyberpunk",
                                vibeFrequency: "96.4 MHz",
                            },
                        });
                    }

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
                } catch (err) {
                    console.error("[AUTH AUTHORIZE ERROR]", err);
                    return null;
                }
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
    trustHost: true,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "vibe_connect_super_secret_session_secret_key_2026",
});
