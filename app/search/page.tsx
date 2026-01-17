'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();

        if (!query.trim()) {
            return;
        }

        setLoading(true);
        setError('');

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
        <div>
            <h1>Semantic Search</h1>

            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search your bookmarks..."
                />
                <button type="submit">Search</button>
            </form>

            {loading && <p>Searching...</p>}

            {error && <p>{error}</p>}

            {results.length > 0 && (
                <ul>
                    {results.map((result: any) => (
                        <li key={result.id}>
                            <a href={result.url} target="_blank" rel="noopener noreferrer">
                                {result.title}
                            </a>
                            <span> (Similarity: {(result.similarity * 100).toFixed(0)}%)</span>
                            {result.description && <p>{result.description}</p>}
                        </li>
                    ))}
                </ul>
            )}

            {!loading && !error && results.length === 0 && query && (
                <p>No results found. Try a different search term.</p>
            )}

            <p>
                <Link href="/">Back to Homepage</Link>
            </p>
        </div>
    );
}
