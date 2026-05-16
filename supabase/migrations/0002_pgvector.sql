-- Week 4: Add pgvector extension and embedding column to kb_chunks
-- Run after 0001_init.sql and after enabling pgvector in Supabase dashboard

create extension if not exists vector;

alter table kb_chunks
  add column if not exists embedding vector(1536);

-- Approximate nearest-neighbor index (IVFFlat)
-- Tune lists based on chunk count: sqrt(n_chunks) as a starting point
create index if not exists kb_chunks_embedding_idx
  on kb_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);
