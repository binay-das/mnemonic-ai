import axios from "axios";

const OLLAMA_URL = process.env.OLLAMA_URL!;

export async function generateEmbedding(
    text: string,
    model: string = 'nomic-embed-text:v1.5'
): Promise<number[]> {
    try {
        const response = await axios.post(`${OLLAMA_URL}/api/embeddings`, {
            model,
            prompt: text
        });

        if (!response.data || !response.data.embedding) {
            throw new Error('Invalid response format from Ollama API');
        }

        return response.data.embedding;
    } catch (error) {
        console.error("Embedding Error:", error);
        throw new Error(`Ollama failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function generateEmbeddings(
    texts: string[],
    model: string = 'nomic-embed-text:v1.5'
): Promise<number[][]> {
    const embeddings = await Promise.all(
        texts.map(text => generateEmbedding(text, model))
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
