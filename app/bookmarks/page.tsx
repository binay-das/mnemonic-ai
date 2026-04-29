import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function BookmarksPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/auth/signin');
    }

    const userId = session.user.id;

    const bookmarks = await prisma.bookmark.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            createdAt: 'desc',
        }
    });

    return (
        <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-5">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                            Library
                        </h1>
                        <p className="mt-1.5 text-sm text-foreground/55">
                            Manage and explore your saved content.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/search"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium border border-[#e7e7e7] dark:border-[#2a2a2a] text-foreground/70 hover:text-foreground hover:border-foreground/20 dark:hover:border-foreground/20 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Search
                        </Link>
                        <Link
                            href="/add"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium bg-[#0d7a6b] hover:bg-[#0a6358] text-white transition-colors dark:bg-[#2dccc0] dark:text-[#0a0a0a] dark:hover:bg-[#5dd8ce]"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Add
                        </Link>
                    </div>
                </div>

                {bookmarks.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-[#e7e7e7] dark:border-[#2a2a2a]">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 border border-[#e7e7e7] dark:border-[#2a2a2a]">
                            <svg className="h-6 w-6 text-[#0d7a6b] dark:text-[#2dccc0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-foreground">No bookmarks yet</h3>
                        <p className="mt-1.5 text-sm text-foreground/50 max-w-sm mx-auto">
                            Get started by saving your first URL. You can then search through them using AI.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/add"
                                className="inline-flex items-center px-5 py-2.5 text-sm font-medium bg-[#0d7a6b] hover:bg-[#0a6358] text-white transition-colors dark:bg-[#2dccc0] dark:text-[#0a0a0a] dark:hover:bg-[#5dd8ce]"
                            >
                                Add your first bookmark
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {bookmarks.map((bookmark) => (
                            <div
                                key={bookmark.id}
                                className="group flex flex-col h-full border border-[#e7e7e7] p-5 transition-colors hover:border-foreground/15 dark:border-[#2a2a2a] dark:hover:border-foreground/15"
                            >
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div className="p-1.5 border border-[#e7e7e7] text-foreground/40 group-hover:border-[#0d7a6b]/30 group-hover:text-[#0d7a6b] dark:border-[#2a2a2a] dark:group-hover:border-[#2dccc0]/30 dark:group-hover:text-[#2dccc0] transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                        </div>
                                        <span className="text-[11px] font-medium text-foreground/30">
                                            {new Date(bookmark.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <a
                                        href={bookmark.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block mb-1.5"
                                    >
                                        <h3 className="text-base font-semibold text-foreground line-clamp-1 group-hover:text-[#0d7a6b] dark:group-hover:text-[#2dccc0] transition-colors">
                                            {bookmark.title}
                                        </h3>
                                    </a>
                                    <p className="text-sm text-foreground/50 line-clamp-3">
                                        {bookmark.description || "No description provided."}
                                    </p>
                                </div>
                                <div className="mt-3 pt-3 border-t border-[#e7e7e7] dark:border-[#2a2a2a] flex items-center justify-between">
                                    <span className="text-[11px] text-foreground/30 truncate max-w-[200px]">
                                        {new URL(bookmark.url).hostname}
                                    </span>
                                    <a
                                        href={bookmark.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-medium text-[#0d7a6b] dark:text-[#2dccc0] hover:underline"
                                    >
                                        Visit →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
