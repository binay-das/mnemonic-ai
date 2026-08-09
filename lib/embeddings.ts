import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

export interface SimilarBookmark {
    id: string;
    url: string;
    title: string;
    description: string | null;
    similarity: number;
    createdAt: Date;
    updatedAt: Date;
}

export async function generateEmbedding(
    text: string,
    model: string = 'gemini-embedding-2',
    taskType?: string
): Promise<number[]> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not configured');
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const config: { outputDimensionality: number; taskType?: string } = {
            outputDimensionality: 768,
        };
        if (taskType) {
            config.taskType = taskType;
        }

        const response = await ai.models.embedContent({
            model,
            contents: text,
            config,
        });

        const embeddingValues = response.embeddings?.[0]?.values;

        if (!embeddingValues) {
            throw new Error('Invalid response format from Gemini Embedding API');
        }

        return embeddingValues;
    } catch (error) {
        console.error("Gemini Embedding Error:", error);
        throw new Error(`Gemini embedding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function generateEmbeddings(
    texts: string[],
    model: string = 'gemini-embedding-2',
    taskType?: string
): Promise<number[][]> {
    const embeddings = await Promise.all(
        texts.map(text => generateEmbedding(text, model, taskType))
    );
    return embeddings;
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
        throw new Error('Embeddings must have the same dimension');
    }

    let dotProduct = 0;
    let mA = 0;
    let mB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        mA += vecA[i] * vecA[i];
        mB += vecB[i] * vecB[i];
    }

    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);

    if (mA === 0 || mB === 0) {
        return 0;
    }

    return dotProduct / (mA * mB);
}

export async function findSimilarBookmarks(
    query: string,
    userId: string,
    limit: number = 20
): Promise<SimilarBookmark[]> {
    const queryEmbedding = await generateEmbedding(query, 'gemini-embedding-2', 'RETRIEVAL_QUERY');

    const embeddingString = `[${queryEmbedding.join(',')}]`;

    const results = await prisma.$queryRaw<SimilarBookmark[]>`
        SELECT 
            id,
            url,
            title,
            description,
            "createdAt",
            "updatedAt",
            1 - (embedding <=> ${embeddingString}::vector) as similarity
        FROM "Bookmark"
        WHERE "userId" = ${userId}
        AND embedding IS NOT NULL
        ORDER BY embedding <=> ${embeddingString}::vector
        LIMIT ${limit}
    `;

    return results;
}
