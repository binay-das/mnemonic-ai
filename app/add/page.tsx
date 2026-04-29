'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AddBookmarkPage() {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsError(false);

        try {
            const response = await fetch('/api/bookmarks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, title, description }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add bookmark');
            }

            setMessage('Bookmark added successfully!');
            setIsError(false);
            setUrl('');
            setTitle('');
            setDescription('');
        } catch (err: unknown) {
            setMessage(err instanceof Error ? err.message : 'Failed to add bookmark');
            setIsError(true);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                        Add Bookmark
                    </h1>
                    <p className="mt-1.5 text-sm text-foreground/55">
                        Save a new URL to your collection for AI-powered semantic search.
                    </p>
                </div>

                <div className="border border-[#e7e7e7] p-6 dark:border-[#2a2a2a] dark:bg-[#121212]">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="url"
                                className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-[0.1em]"
                            >
                                URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="url"
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                                placeholder="https://example.com"
                                className="w-full px-3 py-2.5 text-sm bg-transparent border border-[#e7e7e7] dark:border-[#2a2a2a] focus:outline-none focus:border-[#0d7a6b] text-foreground placeholder:text-foreground/30 transition-colors"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="title"
                                className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-[0.1em]"
                            >
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Enter a descriptive title"
                                className="w-full px-3 py-2.5 text-sm bg-transparent border border-[#e7e7e7] dark:border-[#2a2a2a] focus:outline-none focus:border-[#0d7a6b] text-foreground placeholder:text-foreground/30 transition-colors"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-[0.1em]"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="Add a brief description (optional)"
                                className="w-full px-3 py-2.5 text-sm bg-transparent border border-[#e7e7e7] dark:border-[#2a2a2a] focus:outline-none focus:border-[#0d7a6b] text-foreground placeholder:text-foreground/30 transition-colors resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 text-sm font-medium bg-[#0d7a6b] hover:bg-[#0a6358] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors dark:bg-[#2dccc0] dark:text-[#0a0a0a] dark:hover:bg-[#5dd8ce]"
                        >
                            {loading ? 'Adding...' : 'Add Bookmark'}
                        </button>
                    </form>

                    {message && (
                        <div className={`mt-5 pl-3 border-l-2 ${isError ? 'border-red-500' : 'border-green-500'}`}>
                            <p className={`text-sm ${isError ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                {message}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center">
                    <Link
                        href="/bookmarks"
                        className="inline-flex items-center text-sm text-foreground/40 hover:text-foreground transition-colors gap-1"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Library
                    </Link>
                </div>
            </div>
        </div>
    );
}
