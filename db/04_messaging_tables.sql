-- ============================================
-- UniMinder Database Initialization Script
-- Part 4: Messaging & Conversations
-- ============================================

-- Conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text,
    type text NOT NULL CHECK (type IN ('direct', 'group')) DEFAULT 'direct',
    created_by text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Metadata
    avatar_url text,
    description text,
    
    -- Status
    is_active boolean DEFAULT true,
    
    -- Timestamps
    last_message_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Conversation participants
CREATE TABLE IF NOT EXISTS public.conversation_participants (
    conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role text DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    
    -- Preferences
    is_muted boolean DEFAULT false,
    custom_name text,
    
    -- Status
    joined_at timestamptz DEFAULT now(),
    left_at timestamptz,
    last_read_at timestamptz DEFAULT now(),
    
    PRIMARY KEY (conversation_id, user_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id bigserial PRIMARY KEY,
    conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Content
    content text NOT NULL,
    message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system', 'voice')),
    
    -- Attachments
    attachment_url text,
    attachment_name text,
    attachment_size bigint,
    attachment_mime_type text,
    
    -- Reply threading
    reply_to_id bigint REFERENCES public.messages(id) ON DELETE SET NULL,
    
    -- Status
    is_edited boolean DEFAULT false,
    is_deleted boolean DEFAULT false,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    CONSTRAINT content_required CHECK (length(trim(content)) > 0 OR attachment_url IS NOT NULL)
);

-- Message read receipts
CREATE TABLE IF NOT EXISTS public.message_reads (
    message_id bigint NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    read_at timestamptz DEFAULT now(),
    
    PRIMARY KEY (message_id, user_id)
);

-- Typing indicators (ephemeral, could be moved to Redis in production)
CREATE TABLE IF NOT EXISTS public.typing_indicators (
    conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    started_at timestamptz DEFAULT now(),
    
    PRIMARY KEY (conversation_id, user_id)
);

-- Create indexes for messaging
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON public.conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON public.conversations(updated_at DESC) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON public.conversation_participants(user_id) WHERE left_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation ON public.conversation_participants(conversation_id) WHERE left_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_reply ON public.messages(reply_to_id) WHERE reply_to_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_message_reads_user ON public.message_reads(user_id);

-- Add comments
COMMENT ON TABLE public.conversations IS 'Chat conversations (direct messages and group chats)';
COMMENT ON TABLE public.conversation_participants IS 'Users participating in conversations';
COMMENT ON TABLE public.messages IS 'Messages sent within conversations';
COMMENT ON TABLE public.message_reads IS 'Read receipts for messages';
