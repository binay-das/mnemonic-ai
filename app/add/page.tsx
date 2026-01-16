'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AddBookmarkPage() {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage('');

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
            setUrl('');
            setTitle('');
            setDescription('');
        } catch (err: any) {
            setMessage(err.message || 'Failed to add bookmark');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Add Bookmark</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>URL:</label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Bookmark'}
                </button>
            </form>

            {message && <p>{message}</p>}

            <p>
                <Link href="/">Back to Homepage</Link>
            </p>
        </div>
    );
}
