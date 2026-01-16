import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { generateEmbedding } from '@/lib/embeddings';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { url, title, description } = await request.json();

        if (!url || !title) {
            return NextResponse.json(
                { error: 'url and title are required' },
                { status: 400 }
            );
        }

        const metadata = `Title: ${title}. Description: ${description || ''}`.trim();
        const embedding = await generateEmbedding(metadata);

        const userId = (session.user as any).id;

        const bookmark = await prisma.bookmark.create({
            data: {
                url,
                title,
                description,
                userId
            },
        });

        console.log("bookmark: ", bookmark);

        const updateBookmarkEmbedding = await prisma.$executeRaw`
            UPDATE "Bookmark"
            SET embedding = ${embedding}::vector
            WHERE id = ${bookmark.id}
        `;

        console.log("updateBookmarkEmbedding: ", updateBookmarkEmbedding);

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
