import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function BookmarksPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/signin');
    }

    const userId = (session.user as any).id;

    const bookmarks = await prisma.bookmark.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div>
            <h1>Library</h1>

            <p>
                <Link href="/search">Go to Semantic Search</Link>
            </p>

            {bookmarks.length === 0 ? (
                <p>No bookmarks yet. <Link href="/add">Add one!</Link></p>
            ) : (
                <ul>
                    {bookmarks.map((bookmark) => (
                        <li key={bookmark.id}>
                            <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                                {bookmark.title}
                            </a>
                            {bookmark.description && <p>{bookmark.description}</p>}
                        </li>
                    ))}
                </ul>
            )}

            <p>
                <Link href="/">Back to Homepage</Link>
            </p>
        </div>
    );
}
