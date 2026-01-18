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
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Library
                        </h1>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                            Manage and explore your saved content.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/search"
                            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Semantic Search
                        </Link>
                        <Link
                            href="/add"
                            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Bookmark
                        </Link>
                    </div>
                </div>

                {bookmarks.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-zinc-800">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30">
                            <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">No bookmarks yet</h3>
                        <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                            Get started by saving your first URL. You can then search through them using AI.
                        </p>
                        <div className="mt-8">
                            <Link
                                href="/add"
                                className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                            >
                                Add your first bookmark
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookmarks.map((bookmark) => (
                            <div
                                key={bookmark.id}
                                className="group flex flex-col h-full bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 hover:border-gray-300 dark:hover:border-zinc-700 transition-colors shadow-sm"
                            >
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-2 mb-4">
                                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-medium text-gray-400 dark:text-zinc-500">
                                            {new Date(bookmark.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <a
                                        href={bookmark.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block mb-2"
                                    >
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {bookmark.title}
                                        </h3>
                                    </a>
                                    <p className="text-gray-500 dark:text-zinc-400 text-sm line-clamp-3 mb-4">
                                        {bookmark.description || "No description provided."}
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                                    <span className="text-xs text-gray-400 dark:text-zinc-500 truncate max-w-[200px]">
                                        {new URL(bookmark.url).hostname}
                                    </span>
                                    <a
                                        href={bookmark.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Visit &rarr;
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
