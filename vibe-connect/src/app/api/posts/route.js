import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

// GET /api/posts - fetch posts
export async function GET(req) {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: "desc" },
            take: 30,
            include: {
                author: { select: { id: true, name: true, handle: true, image: true, color: true } },
                _count: { select: { likes: true, comments: true } },
            },
        });
        const formatted = posts.map(p => ({
            _id: p.id,
            content: p.content,
            image: p.image || null,
            tag: p.tag,
            createdAt: p.createdAt,
            authorId: { name: p.author.name, handle: p.author.handle, color: p.author.color },
            likesCount: p._count.likes,
            _count: { likes: p._count.likes, comments: p._count.comments },
        }));
        return NextResponse.json({ posts: formatted });
    } catch (err) {
        console.error("[GET /api/posts]", err);
        return NextResponse.json({ posts: [] });
    }
}

// POST /api/posts - create a post
export async function POST(req) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { content, image, tag } = await req.json();
        if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });

        const post = await prisma.post.create({
            data: { content: content.trim(), image: image || null, tag: tag || null, authorId: session.user.id },
        });
        return NextResponse.json({ post }, { status: 201 });
    } catch (err) {
        console.error("[POST /api/posts]", err);
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
