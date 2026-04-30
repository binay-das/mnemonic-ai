import { prisma } from '@/lib/prisma';

export const MAX_BOOKMARK_TITLE_LENGTH = 200;
export const MAX_BOOKMARK_DESCRIPTION_LENGTH = 2000;
export const MAX_BOOKMARK_TAGS = 20;
export const MAX_BOOKMARK_TAG_LENGTH = 40;
export const DEFAULT_BOOKMARK_LIMIT = 20;
export const MAX_BOOKMARK_LIMIT = 100;

const ALLOWED_URL_PROTOCOLS = new Set(['http:', 'https:']);

type ValidationError = { error: string };
type UrlValidation = { url: string } | ValidationError;
type TitleValidation = { title: string } | ValidationError;
type DescriptionValidation = { description: string | null } | ValidationError;
type TagsValidation = { tags: string[] } | ValidationError;

export type BookmarkPayload = {
    url?: unknown;
    title?: unknown;
    description?: unknown;
    tags?: unknown;
};

export type BookmarkPatchPayload = Partial<BookmarkPayload>;

export type BookmarkValidationResult =
    | {
        url: string;
        title: string;
        description: string | null;
        tags: string[];
    }
    | { error: string };

export type BookmarkPatchValidationResult =
    | {
        url?: string;
        title?: string;
        description?: string | null;
        tags?: string[];
        shouldRegenerateEmbedding: boolean;
    }
    | { error: string };

export function normalizeUrl(rawUrl: string) {
    const parsedUrl = new URL(rawUrl.trim());
    parsedUrl.hash = '';
    return parsedUrl.toString();
}

export function isUniqueConstraintError(error: unknown) {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
    );
}

function validateUrl(value: unknown): UrlValidation {
    const rawUrl = typeof value === 'string' ? value.trim() : '';

    if (!rawUrl) {
        return { error: 'URL is required' };
    }

    let url: string;

    try {
        url = normalizeUrl(rawUrl);
    } catch {
        return { error: 'Enter a valid URL' };
    }

    if (!ALLOWED_URL_PROTOCOLS.has(new URL(url).protocol)) {
        return { error: 'URL must use http or https' };
    }

    return { url };
}

function validateTitle(value: unknown): TitleValidation {
    const title = typeof value === 'string' ? value.trim() : '';

    if (!title) {
        return { error: 'Title is required' };
    }

    if (title.length > MAX_BOOKMARK_TITLE_LENGTH) {
        return { error: `Title must be ${MAX_BOOKMARK_TITLE_LENGTH} characters or fewer` };
    }

    return { title };
}

function validateDescription(value: unknown): DescriptionValidation {
    if (value === undefined || value === null) {
        return { description: null };
    }

    if (typeof value !== 'string') {
        return { error: 'Description must be text' };
    }

    const description = value.trim();

    if (description.length > MAX_BOOKMARK_DESCRIPTION_LENGTH) {
        return { error: `Description must be ${MAX_BOOKMARK_DESCRIPTION_LENGTH} characters or fewer` };
    }

    return { description: description || null };
}

function validateTags(value: unknown): TagsValidation {
    if (value === undefined || value === null) {
        return { tags: [] };
    }

    if (!Array.isArray(value)) {
        return { error: 'Tags must be an array' };
    }

    if (value.length > MAX_BOOKMARK_TAGS) {
        return { error: `Use ${MAX_BOOKMARK_TAGS} tags or fewer` };
    }

    const tags = new Set<string>();

    for (const tag of value) {
        if (typeof tag !== 'string') {
            return { error: 'Tags must be text' };
        }

        const normalizedTag = tag.trim().toLowerCase();

        if (!normalizedTag) {
            continue;
        }

        if (normalizedTag.length > MAX_BOOKMARK_TAG_LENGTH) {
            return { error: `Tags must be ${MAX_BOOKMARK_TAG_LENGTH} characters or fewer` };
        }

        tags.add(normalizedTag);
    }

    return { tags: Array.from(tags) };
}

export function validateBookmarkPayload(body: BookmarkPayload): BookmarkValidationResult {
    const urlValidation = validateUrl(body.url);
    if ('error' in urlValidation) {
        return { error: urlValidation.error === 'URL is required' ? 'url and title are required' : urlValidation.error };
    }

    const titleValidation = validateTitle(body.title);
    if ('error' in titleValidation) {
        return { error: titleValidation.error === 'Title is required' ? 'url and title are required' : titleValidation.error };
    }

    const descriptionValidation = validateDescription(body.description);
    if ('error' in descriptionValidation) {
        return descriptionValidation;
    }

    const tagsValidation = validateTags(body.tags);
    if ('error' in tagsValidation) {
        return tagsValidation;
    }

    return {
        url: urlValidation.url,
        title: titleValidation.title,
        description: descriptionValidation.description,
        tags: tagsValidation.tags,
    };
}

export function validateBookmarkPatchPayload(body: BookmarkPatchPayload): BookmarkPatchValidationResult {
    if (!body || typeof body !== 'object') {
        return { error: 'Request body must be an object' };
    }

    const update: Exclude<BookmarkPatchValidationResult, { error: string }> = {
        shouldRegenerateEmbedding: false,
    };

    if ('url' in body) {
        const urlValidation = validateUrl(body.url);
        if ('error' in urlValidation) {
            return urlValidation;
        }

        update.url = urlValidation.url;
    }

    if ('title' in body) {
        const titleValidation = validateTitle(body.title);
        if ('error' in titleValidation) {
            return titleValidation;
        }

        update.title = titleValidation.title;
        update.shouldRegenerateEmbedding = true;
    }

    if ('description' in body) {
        const descriptionValidation = validateDescription(body.description);
        if ('error' in descriptionValidation) {
            return descriptionValidation;
        }

        update.description = descriptionValidation.description;
        update.shouldRegenerateEmbedding = true;
    }

    if ('tags' in body) {
        const tagsValidation = validateTags(body.tags);
        if ('error' in tagsValidation) {
            return tagsValidation;
        }

        update.tags = tagsValidation.tags;
    }

    if (
        update.url === undefined &&
        update.title === undefined &&
        update.description === undefined &&
        update.tags === undefined
    ) {
        return { error: 'No bookmark fields provided' };
    }

    return update;
}

export function parseBookmarkPagination(searchParams: URLSearchParams) {
    const pageParam = Number(searchParams.get('page') || '1');
    const limitParam = Number(searchParams.get('limit') || String(DEFAULT_BOOKMARK_LIMIT));

    const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit = Number.isInteger(limitParam) && limitParam > 0
        ? Math.min(limitParam, MAX_BOOKMARK_LIMIT)
        : DEFAULT_BOOKMARK_LIMIT;

    return {
        page,
        limit,
        skip: (page - 1) * limit,
    };
}

export function buildTagConnections(tags: string[]) {
    return tags.map((tag) => ({
        where: {
            name: tag,
        },
        create: {
            name: tag,
        },
    }));
}

export async function updateBookmarkEmbedding(bookmarkId: string, title: string, description: string | null) {
    const { generateEmbedding } = await import('@/lib/embeddings');
    const metadata = `Title: ${title}. Description: ${description || ''}`.trim();
    const embedding = await generateEmbedding(metadata);
    const embeddingString = `[${embedding.join(',')}]`;

    await prisma.$executeRaw`
        UPDATE "Bookmark"
        SET embedding = ${embeddingString}::vector
        WHERE id = ${bookmarkId}
    `;
}
