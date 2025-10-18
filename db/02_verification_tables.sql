-- ============================================
-- UniMinder Database Initialization Script
-- Part 2: Verification System
-- ============================================

-- Verification requests table
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id bigserial PRIMARY KEY,
    user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    verification_type text NOT NULL CHECK (verification_type IN ('id_card', 'phone', 'document')),
    status verification_status NOT NULL DEFAULT 'pending',
    
    -- Phone verification
    phone_number text,
    verification_code text,
    code_expires_at timestamptz,
    code_attempts integer DEFAULT 0,
    
    -- Document verification
    documents jsonb DEFAULT '[]',
    
    -- Admin review
    admin_notes text,
    reviewed_by text REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at timestamptz,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    CONSTRAINT unique_user_verification UNIQUE(user_id, verification_type)
);

-- Verification documents table (for detailed tracking)
CREATE TABLE IF NOT EXISTS public.verification_documents (
    id bigserial PRIMARY KEY,
    request_id bigint NOT NULL REFERENCES public.verification_requests(id) ON DELETE CASCADE,
    user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    document_type text NOT NULL CHECK (document_type IN ('id_card_front', 'id_card_back', 'additional')),
    file_name text NOT NULL,
    file_url text NOT NULL,
    file_size bigint,
    mime_type text,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason text,
    uploaded_at timestamptz DEFAULT now(),
    reviewed_at timestamptz
);

-- Create indexes for verification
CREATE INDEX IF NOT EXISTS idx_verification_requests_user ON public.verification_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON public.verification_requests(status) WHERE status != 'approved';
CREATE INDEX IF NOT EXISTS idx_verification_documents_request ON public.verification_documents(request_id);
CREATE INDEX IF NOT EXISTS idx_verification_documents_user ON public.verification_documents(user_id);

-- Add comments
COMMENT ON TABLE public.verification_requests IS 'Tracks verification requests for students, alumni, and aspirants';
COMMENT ON TABLE public.verification_documents IS 'Stores uploaded verification documents with metadata';
