import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { findSimilarBookmarks } from '@/lib/embeddings';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json(
                { error: 'Search query parameter "q" is required' },
                { status: 400 }
            );
        }

        const userId = (session.user as any).id;

        const similarBookmarks = await findSimilarBookmarks(query, userId);

        return NextResponse.json({
            success: true,
            query,
            results: similarBookmarks,
            count: similarBookmarks.length
        });

    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            {
                error: 'Failed to search bookmarks',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
