import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/db";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    basePath: "/api/auth",
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const email = credentials.email.trim().toLowerCase();
                const password = credentials.password;

                // 1. Guaranteed Demo Account Bypass
                if (email === "demo@vibeconnect.com" && password === "vibemaster99") {
                    try {
                        let demoUser = await prisma.user.findUnique({ where: { email } });
                        if (!demoUser) {
                            const hashedPassword = await bcrypt.hash("vibemaster99", 10);
                            demoUser = await prisma.user.create({
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
                        return {
                            id: demoUser.id,
                            name: demoUser.name,
                            email: demoUser.email,
                            handle: demoUser.handle,
                            image: demoUser.image || null,
                        };
                    } catch (dbErr) {
                        console.warn("[DEMO AUTH DB BYPASS]", dbErr?.message || dbErr);
                        return {
                            id: "demo-user-nova-echo",
                            name: "Nova Echo (Demo)",
                            email: "demo@vibeconnect.com",
                            handle: "@nova_echo",
                            image: null,
                        };
                    }
                }

                // 2. Standard User Database Authentication
                try {
                    const user = await prisma.user.findUnique({
                        where: { email },
                    });

                    if (!user || !user.password) return null;

                    const isValid = await bcrypt.compare(password, user.password);
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
