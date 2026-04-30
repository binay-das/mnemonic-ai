import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { generateEmbedding } from '@/lib/embeddings';
import { NextRequest, NextResponse } from 'next/server';

type SessionUserWithId = {
    id: string;
};

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;
const ALLOWED_URL_PROTOCOLS = new Set(['http:', 'https:']);

type BookmarkPayload = {
    url?: unknown;
    title?: unknown;
    description?: unknown;
};

function validateBookmarkPayload(body: BookmarkPayload) {
    const rawUrl = typeof body.url === 'string' ? body.url.trim() : '';
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : undefined;

    if (!rawUrl || !title) {
        return { error: 'url and title are required' };
    }

    let parsedUrl: URL;

    try {
        parsedUrl = new URL(rawUrl);
    } catch {
        return { error: 'Enter a valid URL' };
    }

    if (!ALLOWED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
        return { error: 'URL must use http or https' };
    }

    if (title.length > MAX_TITLE_LENGTH) {
        return { error: `Title must be ${MAX_TITLE_LENGTH} characters or fewer` };
    }

    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
        return { error: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer` };
    }

    return {
        url: parsedUrl.toString(),
        title,
        description,
    };
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
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

        const metadata = `Title: ${validation.title}. Description: ${validation.description || ''}`.trim();
        const embedding = await generateEmbedding(metadata);

        const userId = (session.user as SessionUserWithId).id;

        const bookmark = await prisma.bookmark.create({
            data: {
                url: validation.url,
                title: validation.title,
                description: validation.description,
                userId
            },
        });

        const embeddingString = `[${embedding.join(',')}]`;

        await prisma.$executeRaw`
            UPDATE "Bookmark"
            SET embedding = ${embeddingString}::vector
            WHERE id = ${bookmark.id}
        `;

        return NextResponse.json({
            success: true,
            message: 'Bookmark created successfully',
            bookmark
        }, { status: 201 });

    } catch (error) {
        console.error('Bookmark creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create bookmark', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
