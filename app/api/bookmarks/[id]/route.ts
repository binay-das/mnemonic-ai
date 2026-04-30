import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import {
    BookmarkPatchPayload,
    buildTagConnections,
    isUniqueConstraintError,
    updateBookmarkEmbedding,
    validateBookmarkPatchPayload,
} from '@/lib/bookmarks';

type SessionUserWithId = {
    id: string;
};

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

function getUserId(session: Session | null) {
    return (session?.user as SessionUserWithId | undefined)?.id;
}

export async function GET(_request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        const userId = getUserId(session);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await context.params;
        const bookmark = await prisma.bookmark.findFirst({
            where: {
                id,
                userId,
            },
            include: {
                tags: {
                    orderBy: {
                        name: 'asc',
                    },
                },
            },
        });

        if (!bookmark) {
            return NextResponse.json(
                { error: 'Bookmark not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            bookmark,
        });
    } catch (error) {
        console.error('Bookmark fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch bookmark' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        const userId = getUserId(session);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await context.params;
        const body = await request.json() as BookmarkPatchPayload;
        const validation = validateBookmarkPatchPayload(body);

        if ('error' in validation) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        const existingBookmark = await prisma.bookmark.findFirst({
            where: {
                id,
                userId,
            },
            select: {
                id: true,
                title: true,
                description: true,
            },
        });

        if (!existingBookmark) {
            return NextResponse.json(
                { error: 'Bookmark not found' },
                { status: 404 }
            );
        }

        if (validation.url) {
            const duplicateBookmark = await prisma.bookmark.findFirst({
                where: {
                    userId,
                    url: validation.url,
                    NOT: {
                        id,
                    },
                },
                select: {
                    id: true,
                },
            });

            if (duplicateBookmark) {
                return NextResponse.json(
                    { error: 'Bookmark already exists for this URL' },
                    { status: 409 }
                );
            }
        }

        const bookmark = await prisma.bookmark.update({
            where: {
                id,
            },
            data: {
                ...(validation.url !== undefined ? { url: validation.url } : {}),
                ...(validation.title !== undefined ? { title: validation.title } : {}),
                ...(validation.description !== undefined ? { description: validation.description } : {}),
                ...(validation.tags !== undefined
                    ? {
                        tags: {
                            set: [],
                            connectOrCreate: buildTagConnections(validation.tags),
                        },
                    }
                    : {}),
            },
            include: {
                tags: {
                    orderBy: {
                        name: 'asc',
                    },
                },
            },
        });

        if (validation.shouldRegenerateEmbedding) {
            await updateBookmarkEmbedding(bookmark.id, bookmark.title, bookmark.description);
        }

        return NextResponse.json({
            success: true,
            message: 'Bookmark updated successfully',
            bookmark,
        });
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            return NextResponse.json(
                { error: 'Bookmark already exists for this URL' },
                { status: 409 }
            );
        }

        console.error('Bookmark update error:', error);
        return NextResponse.json(
            { error: 'Failed to update bookmark' },
            { status: 500 }
        );
    }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        const userId = getUserId(session);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await context.params;
        const bookmark = await prisma.bookmark.findFirst({
            where: {
                id,
                userId,
            },
            select: {
                id: true,
            },
        });

        if (!bookmark) {
            return NextResponse.json(
                { error: 'Bookmark not found' },
                { status: 404 }
            );
        }

        await prisma.bookmark.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Bookmark deleted successfully',
        });
    } catch (error) {
        console.error('Bookmark delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete bookmark' },
            { status: 500 }
        );
    }
}
