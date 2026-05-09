import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

// POST /api/posts/[id]/like
export async function POST(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const postId = params.id;
        const userId = session.user.id;

        const existing = await prisma.like.findUnique({
            where: { userId_postId: { userId, postId } },
        });

        if (existing) {
            await prisma.like.delete({ where: { userId_postId: { userId, postId } } });
            return NextResponse.json({ liked: false });
        } else {
            await prisma.like.create({ data: { userId, postId } });
            return NextResponse.json({ liked: true });
        }
    } catch (err) {
        console.error("[POST like]", err);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
