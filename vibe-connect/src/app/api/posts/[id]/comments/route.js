import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

// GET /api/posts/[id]/comments
export async function GET(req, { params }) {
    try {
        const comments = await prisma.comment.findMany({
            where: { postId: params.id },
            orderBy: { createdAt: "asc" },
            include: { author: { select: { name: true, handle: true } } },
        });
        const formatted = comments.map(c => ({
            _id: c.id,
            content: c.content,
            createdAt: c.createdAt,
            authorId: { name: c.author.name, handle: c.author.handle },
        }));
        return NextResponse.json({ comments: formatted });
    } catch (err) {
        return NextResponse.json({ comments: [] });
    }
}

// POST /api/posts/[id]/comments
export async function POST(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { content } = await req.json();
        if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });

        const comment = await prisma.comment.create({
            data: { content: content.trim(), postId: params.id, authorId: session.user.id },
        });
        return NextResponse.json({ comment }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
