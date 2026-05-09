import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/posts/search?q=query
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q") || "";
        if (q.length < 2) return NextResponse.json({ posts: [] });

        const posts = await prisma.post.findMany({
            where: { content: { contains: q } },
            orderBy: { createdAt: "desc" },
            take: 20,
            include: {
                author: { select: { name: true, handle: true } },
                _count: { select: { likes: true } },
            },
        });

        return NextResponse.json({
            posts: posts.map(p => ({
                _id: p.id,
                content: p.content,
                tag: p.tag,
                createdAt: p.createdAt,
                authorId: { name: p.author.name, handle: p.author.handle },
                likesCount: p._count.likes,
            })),
        });
    } catch (err) {
        return NextResponse.json({ posts: [] });
    }
}
