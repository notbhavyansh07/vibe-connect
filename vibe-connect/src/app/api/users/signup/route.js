import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { name, email, handle, password } = await req.json();

        // Validate inputs
        if (!name || !email || !handle || !password) {
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters." },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingEmail = await prisma.user.findUnique({
            where: { email },
        });
        if (existingEmail) {
            return NextResponse.json(
                { error: "An account with this email already exists." },
                { status: 409 }
            );
        }

        // Normalise handle (ensure it starts with @)
        const normalizedHandle = handle.startsWith("@") ? handle : `@${handle}`;

        // Check if handle already exists
        const existingHandle = await prisma.user.findUnique({
            where: { handle: normalizedHandle },
        });
        if (existingHandle) {
            return NextResponse.json(
                { error: "That vibe handle is already taken." },
                { status: 409 }
            );
        }

        // Hash password with bcrypt (12 rounds)
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                handle: normalizedHandle,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            { message: "Account created successfully!", userId: user.id },
            { status: 201 }
        );
    } catch (err) {
        console.error("[SIGNUP ERROR]", err);
        return NextResponse.json(
            { error: `Database Connection Error. Please verify your Vercel DATABASE_URL is a valid PostgreSQL string. (Detail: ${err.message})` },
            { status: 500 }
        );
    }
}
