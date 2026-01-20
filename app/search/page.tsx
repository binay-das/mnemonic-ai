'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SearchPage() {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<any[]>([]);
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
        } catch (err: any) {
            setError(err.message || 'Failed to search');
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                        Semantic Search
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Explore your bookmarks with intelligent vector search.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="mb-10">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter your search query..."
                            className="w-full px-5 py-4 text-lg bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 shadow-sm transition-colors duration-200"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {loading && (
                    <div className="py-12 text-center">
                        <div className="inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full animate-spin" role="status" aria-label="loading">
                        </div>
                        <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Searching embeddings...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
                        <div className="flex">
                            <div className="shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {results.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-4">
                            Search Results
                        </h2>
                        {results.map((result: any) => (
                            <div
                                key={result.id}
                                className="group bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-900 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <a
                                            href={result.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                                        >
                                            {result.title}
                                        </a>
                                        <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-zinc-500">
                                            <span className="truncate max-w-[300px]">{result.url}</span>
                                        </div>
                                    </div>
                                    <div className="shrink-0">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${result.similarity > 0.8
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : result.similarity > 0.6
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                : 'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-400'
                                            }`}>
                                            {(result.similarity * 100).toFixed(0)}% match
                                        </span>
                                    </div>
                                </div>
                                {result.description && (
                                    <p className="mt-3 text-base text-gray-600 dark:text-zinc-400 line-clamp-2">
                                        {result.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && results.length === 0 && hasSearched && (
                    <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-gray-300 dark:border-zinc-800">
                        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-4 text-gray-500 dark:text-zinc-400 text-lg">No matches found for "{query}"</p>
                        <p className="text-gray-400 dark:text-zinc-500 text-sm mt-2">Try different keywords or check your spelling.</p>
                    </div>
                )}

                <div className="mt-12 text-center text-sm">
                    <Link
                        href="/"
                        className="text-gray-500 hover:text-gray-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
