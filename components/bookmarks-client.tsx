'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

type BookmarkTag = {
    id: string;
    name: string;
};

type Bookmark = {
    id: string;
    url: string;
    title: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    tags: BookmarkTag[];
};

type Pagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

type BookmarksResponse = {
    bookmarks: Bookmark[];
    pagination: Pagination;
};

type EditForm = {
    url: string;
    title: string;
    description: string;
    tags: string;
};

const PAGE_SIZE = 12;

function parseTags(value: string) {
    return value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
}

function getHostname(url: string) {
    try {
        return new URL(url).hostname;
    } catch {
        return url;
    }
}

export function BookmarksClient() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 0,
    });
    const [page, setPage] = useState(1);
    const [tagFilter, setTagFilter] = useState('');
    const [tagDraft, setTagDraft] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
    const [editForm, setEditForm] = useState<EditForm>({
        url: '',
        title: '',
        description: '',
        tags: '',
    });

    const fetchBookmarks = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(PAGE_SIZE),
            });

            if (tagFilter) {
                params.set('tag', tagFilter);
            }

            const response = await fetch(`/api/bookmarks?${params.toString()}`);
            const data = await response.json() as Partial<BookmarksResponse> & { error?: string };

            if (!response.ok) {
                throw new Error(data.error || 'Failed to load bookmarks');
            }

            setBookmarks(data.bookmarks || []);
            setPagination(data.pagination || {
                page,
                limit: PAGE_SIZE,
                total: 0,
                totalPages: 0,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load bookmarks');
            setBookmarks([]);
        } finally {
            setLoading(false);
        }
    }, [page, tagFilter]);

    useEffect(() => {
        fetchBookmarks();
    }, [fetchBookmarks]);

    const visibleTags = useMemo(() => {
        const names = new Set<string>();

        for (const bookmark of bookmarks) {
            for (const tag of bookmark.tags) {
                names.add(tag.name);
            }
        }

        return Array.from(names).sort();
    }, [bookmarks]);

    function openEdit(bookmark: Bookmark) {
        setEditingBookmark(bookmark);
        setEditForm({
            url: bookmark.url,
            title: bookmark.title,
            description: bookmark.description || '',
            tags: bookmark.tags.map((tag) => tag.name).join(', '),
        });
        setError('');
    }

    function closeEdit() {
        setEditingBookmark(null);
        setSaving(false);
        setError('');
    }

    async function updateBookmark(e: React.FormEvent) {
        e.preventDefault();

        if (!editingBookmark) {
            return;
        }

        setSaving(true);
        setError('');

        try {
            const response = await fetch(`/api/bookmarks/${editingBookmark.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: editForm.url,
                    title: editForm.title,
                    description: editForm.description,
                    tags: parseTags(editForm.tags),
                }),
            });
            const data = await response.json() as { bookmark?: Bookmark; error?: string };

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update bookmark');
            }

            if (data.bookmark) {
                setBookmarks((current) => current.map((bookmark) => (
                    bookmark.id === data.bookmark?.id ? data.bookmark : bookmark
                )));
            }

            closeEdit();
            fetchBookmarks();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update bookmark');
        } finally {
            setSaving(false);
        }
    }

    async function deleteBookmark(bookmark: Bookmark) {
        const confirmed = window.confirm(`Delete "${bookmark.title}"?`);

        if (!confirmed) {
            return;
        }

        setDeletingId(bookmark.id);
        setError('');

        try {
            const response = await fetch(`/api/bookmarks/${bookmark.id}`, {
                method: 'DELETE',
            });
            const data = await response.json() as { error?: string };

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete bookmark');
            }

            const remainingOnPage = bookmarks.length - 1;
            if (remainingOnPage === 0 && page > 1) {
                setPage((current) => current - 1);
            } else {
                fetchBookmarks();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete bookmark');
        } finally {
            setDeletingId(null);
        }
    }

    function applyTagFilter(e: React.FormEvent) {
        e.preventDefault();
        setPage(1);
        setTagFilter(tagDraft.trim().toLowerCase());
    }

    function clearTagFilter() {
        setPage(1);
        setTagFilter('');
        setTagDraft('');
    }

    return (
        <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-5">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                            Library
                        </h1>
                        <p className="mt-1.5 text-sm text-foreground/55">
                            Manage, tag, and revisit your saved content.
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

                <div className="mb-6 border border-[#e7e7e7] p-4 dark:border-[#2a2a2a] dark:bg-[#121212]">
                    <form onSubmit={applyTagFilter} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="flex-1">
                            <label htmlFor="tag-filter" className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-[0.1em]">
                                Tag filter
                            </label>
                            <input
                                id="tag-filter"
                                value={tagDraft}
                                onChange={(e) => setTagDraft(e.target.value)}
                                placeholder="research, docs, ideas"
                                className="w-full px-3 py-2.5 text-sm bg-transparent border border-[#e7e7e7] dark:border-[#2a2a2a] focus:outline-none focus:border-[#0d7a6b] text-foreground placeholder:text-foreground/30 transition-colors"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="px-4 py-2.5 text-sm font-medium bg-[#0d7a6b] hover:bg-[#0a6358] text-white transition-colors dark:bg-[#2dccc0] dark:text-[#0a0a0a] dark:hover:bg-[#5dd8ce]"
                            >
                                Filter
                            </button>
                            {tagFilter && (
                                <button
                                    type="button"
                                    onClick={clearTagFilter}
                                    className="px-4 py-2.5 text-sm font-medium border border-[#e7e7e7] dark:border-[#2a2a2a] text-foreground/70 hover:text-foreground transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </form>

                    {visibleTags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {visibleTags.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => {
                                        setTagDraft(tag);
                                        setTagFilter(tag);
                                        setPage(1);
                                    }}
                                    className={`px-2 py-1 text-[11px] font-medium border transition-colors ${tagFilter === tag
                                        ? 'border-[#0d7a6b] bg-[#eef7f8] text-[#0a6358] dark:border-[#2dccc0] dark:bg-[#11292d] dark:text-[#2dccc0]'
                                        : 'border-[#e7e7e7] text-foreground/45 hover:text-foreground dark:border-[#2a2a2a]'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mb-6 border-l-2 border-red-500 pl-4 py-3">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="py-20 text-center text-sm text-foreground/40">
                        Loading bookmarks...
                    </div>
                ) : bookmarks.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-[#e7e7e7] dark:border-[#2a2a2a]">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 border border-[#e7e7e7] dark:border-[#2a2a2a]">
                            <svg className="h-6 w-6 text-[#0d7a6b] dark:text-[#2dccc0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-foreground">
                            {tagFilter ? `No bookmarks tagged ${tagFilter}` : 'No bookmarks yet'}
                        </h3>
                        <p className="mt-1.5 text-sm text-foreground/50 max-w-sm mx-auto">
                            {tagFilter ? 'Clear the filter or add this tag to a bookmark.' : 'Get started by saving your first URL.'}
                        </p>
                        {!tagFilter && (
                            <div className="mt-6">
                                <Link
                                    href="/add"
                                    className="inline-flex items-center px-5 py-2.5 text-sm font-medium bg-[#0d7a6b] hover:bg-[#0a6358] text-white transition-colors dark:bg-[#2dccc0] dark:text-[#0a0a0a] dark:hover:bg-[#5dd8ce]"
                                >
                                    Add your first bookmark
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
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
                                            {bookmark.description || 'No description provided.'}
                                        </p>
                                        {bookmark.tags.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1.5">
                                                {bookmark.tags.map((tag) => (
                                                    <button
                                                        key={tag.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setTagDraft(tag.name);
                                                            setTagFilter(tag.name);
                                                            setPage(1);
                                                        }}
                                                        className="px-2 py-0.5 text-[11px] font-medium bg-[#f5f5f4] text-foreground/55 hover:text-[#0d7a6b] dark:bg-[#1a1a1a] dark:hover:text-[#2dccc0]"
                                                    >
                                                        {tag.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-[#e7e7e7] dark:border-[#2a2a2a] flex items-center justify-between gap-3">
                                        <span className="text-[11px] text-foreground/30 truncate">
                                            {getHostname(bookmark.url)}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(bookmark)}
                                                className="text-xs font-medium text-foreground/45 hover:text-foreground"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteBookmark(bookmark)}
                                                disabled={deletingId === bookmark.id}
                                                className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-40 dark:text-red-400"
                                            >
                                                {deletingId === bookmark.id ? 'Deleting' : 'Delete'}
                                            </button>
                                            <a
                                                href={bookmark.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs font-medium text-[#0d7a6b] dark:text-[#2dccc0] hover:underline"
                                            >
                                                Visit
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[#e7e7e7] pt-4 text-sm text-foreground/50 dark:border-[#2a2a2a] sm:flex-row">
                            <span>
                                Page {pagination.page} of {Math.max(pagination.totalPages, 1)} - {pagination.total} bookmarks
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPage((current) => Math.max(current - 1, 1))}
                                    disabled={pagination.page <= 1}
                                    className="px-3 py-2 border border-[#e7e7e7] text-sm font-medium text-foreground/60 disabled:opacity-40 dark:border-[#2a2a2a]"
                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPage((current) => current + 1)}
                                    disabled={pagination.page >= pagination.totalPages}
                                    className="px-3 py-2 border border-[#e7e7e7] text-sm font-medium text-foreground/60 disabled:opacity-40 dark:border-[#2a2a2a]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {editingBookmark && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
                    <div className="w-full max-w-lg border border-[#e7e7e7] bg-[#ffffff] p-6 dark:border-[#2a2a2a] dark:bg-[#121212]">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold tracking-tight text-foreground">Edit bookmark</h2>
                                <p className="mt-1 text-sm text-foreground/45">Update details, tags, or remove stale context.</p>
                            </div>
                            <button
                                type="button"
                                onClick={closeEdit}
                                className="text-sm text-foreground/40 hover:text-foreground"
                            >
                                Close
                            </button>
                        </div>

                        <form onSubmit={updateBookmark} className="space-y-4">
                            <div>
                                <label htmlFor="edit-url" className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-[0.1em]">
                                    URL
                                </label>
                                <input
                                    id="edit-url"
                                    type="url"
                                    required
                                    value={editForm.url}
                                    onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                                    className="w-full px-3 py-2.5 text-sm bg-transparent border border-[#e7e7e7] dark:border-[#2a2a2a] focus:outline-none focus:border-[#0d7a6b] text-foreground"
                                />
                            </div>
                            <div>
                                <label htmlFor="edit-title" className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-[0.1em]">
                                    Title
                                </label>
                                <input
                                    id="edit-title"
                                    required
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full px-3 py-2.5 text-sm bg-transparent border border-[#e7e7e7] dark:border-[#2a2a2a] focus:outline-none focus:border-[#0d7a6b] text-foreground"
                                />
                            </div>
                            <div>
                                <label htmlFor="edit-description" className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-[0.1em]">
                                    Description
                                </label>
                                <textarea
                                    id="edit-description"
                                    rows={3}
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    className="w-full px-3 py-2.5 text-sm bg-transparent border border-[#e7e7e7] dark:border-[#2a2a2a] focus:outline-none focus:border-[#0d7a6b] text-foreground resize-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="edit-tags" className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-[0.1em]">
                                    Tags
                                </label>
                                <input
                                    id="edit-tags"
                                    value={editForm.tags}
                                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                                    placeholder="research, docs, ideas"
                                    className="w-full px-3 py-2.5 text-sm bg-transparent border border-[#e7e7e7] dark:border-[#2a2a2a] focus:outline-none focus:border-[#0d7a6b] text-foreground placeholder:text-foreground/30"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={closeEdit}
                                    className="px-4 py-2.5 text-sm font-medium border border-[#e7e7e7] dark:border-[#2a2a2a] text-foreground/70"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2.5 text-sm font-medium bg-[#0d7a6b] hover:bg-[#0a6358] disabled:opacity-40 text-white transition-colors dark:bg-[#2dccc0] dark:text-[#0a0a0a]"
                                >
                                    {saving ? 'Saving' : 'Save changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
