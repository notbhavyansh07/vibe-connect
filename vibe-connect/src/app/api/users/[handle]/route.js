import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/users/[handle]
export async function GET(req, { params }) {
    try {
        const handle = decodeURIComponent(params.handle);
        const normalizedHandle = handle.startsWith("@") ? handle : `@${handle}`;

        const user = await prisma.user.findFirst({
            where: {
                OR: [{ handle: normalizedHandle }, { handle }],
            },
            select: { id: true, name: true, handle: true, bio: true, image: true, color: true, createdAt: true },
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const [posts, followerCount, followingCount] = await Promise.all([
            prisma.post.findMany({
                where: { authorId: user.id },
                orderBy: { createdAt: "desc" },
                take: 20,
                include: { _count: { select: { likes: true, comments: true } } },
            }),
            prisma.follows.count({ where: { followingId: user.id } }),
            prisma.follows.count({ where: { followerId: user.id } }),
        ]);

        return NextResponse.json({
            user,
            posts: posts.map(p => ({ _id: p.id, content: p.content, tag: p.tag, createdAt: p.createdAt, likesCount: p._count.likes })),
            stats: { followers: followerCount, following: followingCount, postCount: posts.length },
        });
    } catch (err) {
        console.error("[GET /api/users/[handle]]", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
