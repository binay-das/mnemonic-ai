import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { BookmarksClient } from '@/components/bookmarks-client';

export default async function BookmarksPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/auth/signin');
    }

    return <BookmarksClient />;
}
