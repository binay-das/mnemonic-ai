import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import {
    BookmarkPayload,
    buildTagConnections,
    isUniqueConstraintError,
    parseBookmarkPagination,
    updateBookmarkEmbedding,
    validateBookmarkPayload,
} from '@/lib/bookmarks';

type SessionUserWithId = {
    id: string;
};

function getUserId(session: Session | null) {
    return (session?.user as SessionUserWithId | undefined)?.id;
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const userId = getUserId(session);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const { page, limit, skip } = parseBookmarkPagination(searchParams);
        const tag = searchParams.get('tag')?.trim().toLowerCase();

        const where = {
            userId,
            ...(tag
                ? {
                    tags: {
                        some: {
                            name: tag,
                        },
                    },
                }
                : {}),
        };

        const [bookmarks, total] = await prisma.$transaction([
            prisma.bookmark.findMany({
                where,
                include: {
                    tags: {
                        orderBy: {
                            name: 'asc',
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.bookmark.count({
                where,
            }),
        ]);

        return NextResponse.json({
            success: true,
            bookmarks,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Bookmark list error:', error);
        return NextResponse.json(
            { error: 'Failed to list bookmarks' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const userId = getUserId(session);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json() as BookmarkPayload;
        const validation = validateBookmarkPayload(body);

        if ('error' in validation) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        const existingBookmark = await prisma.bookmark.findFirst({
            where: {
                userId,
                url: validation.url,
            },
            select: {
                id: true,
            },
        });

        if (existingBookmark) {
            return NextResponse.json(
                { error: 'Bookmark already exists for this URL' },
                { status: 409 }
            );
        }

        const bookmark = await prisma.bookmark.create({
            data: {
                url: validation.url,
                title: validation.title,
                description: validation.description,
                userId,
                tags: validation.tags.length
                    ? {
                        connectOrCreate: buildTagConnections(validation.tags),
                    }
                    : undefined,
            },
            include: {
                tags: {
                    orderBy: {
                        name: 'asc',
                    },
                },
            },
        });

        await updateBookmarkEmbedding(bookmark.id, bookmark.title, bookmark.description, validation.tags);

        return NextResponse.json({
            success: true,
            message: 'Bookmark created successfully',
            bookmark
        }, { status: 201 });

    } catch (error) {
        if (isUniqueConstraintError(error)) {
            return NextResponse.json(
                { error: 'Bookmark already exists for this URL' },
                { status: 409 }
            );
        }

        console.error('Bookmark creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create bookmark' },
            { status: 500 }
        );
    }
}
