'use client';

import { useState } from 'react';
import Link from 'next/link';

type SearchResult = {
    id: string;
    title: string;
    url: string;
    description?: string;
    similarity: number;
};

export default function SearchPage() {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();

        if (!query.trim()) {
            return;
        }

        setLoading(true);
        setError('');
        setHasSearched(true);

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Search failed');
            }

            setResults(data.results || []);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to search');
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
                        Semantic Search
                    </h1>
                    <p className="text-sm text-foreground/55">
                        Explore your bookmarks with intelligent vector search.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex items-center border border-[#e7e7e7] dark:border-[#2a2a2a]">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter your search query..."
                            className="flex-1 px-4 py-3 text-sm bg-transparent text-foreground placeholder:text-foreground/30 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="px-5 py-3 text-sm font-medium bg-[#0d7a6b] hover:bg-[#0a6358] text-white transition-colors dark:bg-[#2dccc0] dark:text-[#0a0a0a] dark:hover:bg-[#5dd8ce]"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {loading && (
                    <div className="py-12 text-center">
                        <div className="inline-block w-6 h-6 border-2 border-current border-t-transparent text-[#0d7a6b] dark:text-[#2dccc0] rounded-full animate-spin" role="status" aria-label="loading">
                        </div>
                        <p className="mt-3 text-sm text-foreground/40 font-medium">Searching embeddings...</p>
                    </div>
                )}

                {error && (
                    <div className="border-l-2 border-red-500 pl-4 py-3 mb-6">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {results.length > 0 && (
                    <div className="space-y-2">
                        <h2 className="text-[11px] font-semibold text-foreground/30 uppercase tracking-[0.15em] mb-3">
                            Results
                        </h2>
                        {results.map((result) => (
                            <div
                                key={result.id}
                                className="group border border-[#e7e7e7] p-4 transition-colors hover:border-foreground/15 dark:border-[#2a2a2a] dark:hover:border-foreground/15"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <a
                                            href={result.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-base font-semibold text-foreground group-hover:text-[#0d7a6b] dark:group-hover:text-[#2dccc0] transition-colors"
                                        >
                                            {result.title}
                                        </a>
                                        <div className="mt-1 text-xs text-foreground/30 truncate">
                                            {result.url}
                                        </div>
                                    </div>
                                    <div className="shrink-0">
                                        <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium ${
                                            result.similarity > 0.8
                                                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                            : result.similarity > 0.6
                                                ? 'bg-[#eef7f8] text-[#0a6358] dark:bg-[#11292d] dark:text-[#2dccc0]'
                                                : 'bg-[#f5f5f4] text-foreground/50 dark:bg-[#1a1a1a] dark:text-foreground/50'
                                        }`}>
                                            {(result.similarity * 100).toFixed(0)}% match
                                        </span>
                                    </div>
                                </div>
                                {result.description && (
                                    <p className="mt-2 text-sm text-foreground/50 line-clamp-2">
                                        {result.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && results.length === 0 && hasSearched && (
                    <div className="text-center py-16 border border-dashed border-[#e7e7e7] dark:border-[#2a2a2a]">
                        <svg className="mx-auto h-10 w-10 text-foreground/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-3 text-sm text-foreground/40">No matches found for "{query}"</p>
                        <p className="text-xs text-foreground/30 mt-1">Try different keywords or check your spelling.</p>
                    </div>
                )}

                <div className="mt-10 text-center text-sm">
                    <Link
                        href="/"
                        className="text-foreground/40 hover:text-foreground transition-colors inline-flex items-center gap-1"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
