-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create HNSW Vector Index on Bookmark embedding column
CREATE INDEX IF NOT EXISTS "Bookmark_embedding_hnsw_idx" 
ON public."Bookmark" 
USING hnsw (embedding vector_cosine_ops);

-- Enable Row Level Security (RLS) on tables
ALTER TABLE public."Bookmark" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Tag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user isolation
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'Bookmark' AND policyname = 'Users can access their own bookmarks'
    ) THEN
        CREATE POLICY "Users can access their own bookmarks" ON public."Bookmark"
            FOR ALL USING (auth.uid()::text = "userId");
    END IF;
END $$;
