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

