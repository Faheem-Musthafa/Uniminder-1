-- ============================================
-- UniMinder Database Initialization Script
-- Part 5: Mentorship & Connections
-- ============================================

-- Mentorship connections
CREATE TABLE IF NOT EXISTS public.mentorship_connections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentee_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Request details
    message text,
    mentorship_areas text[] DEFAULT '{}',
    
    -- Status tracking
    status text NOT NULL CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')) DEFAULT 'pending',
    
    -- Timestamps
    requested_at timestamptz DEFAULT now(),
    responded_at timestamptz,
    accepted_at timestamptz,
    completed_at timestamptz,
    cancelled_at timestamptz,
    
    -- Feedback
    notes text,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    feedback text,
    mentor_feedback text,
    mentee_feedback text,
    
    CONSTRAINT unique_mentorship UNIQUE(mentor_id, mentee_id),
    CONSTRAINT no_self_mentorship CHECK (mentor_id != mentee_id)
);

-- Connection requests (for general networking)
CREATE TABLE IF NOT EXISTS public.connection_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Request details
    message text,
    
    -- Status
    status text NOT NULL CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')) DEFAULT 'pending',
    
    -- Timestamps
    requested_at timestamptz DEFAULT now(),
    responded_at timestamptz,
    
    CONSTRAINT unique_connection UNIQUE(requester_id, recipient_id),
    CONSTRAINT no_self_connection CHECK (requester_id != recipient_id)
);

-- User connections (accepted connections)
CREATE TABLE IF NOT EXISTS public.user_connections (
    user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    connected_user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Metadata
    note text,
    tags text[] DEFAULT '{}',
    
    -- Timestamps
    connected_at timestamptz DEFAULT now(),
    
    PRIMARY KEY (user_id, connected_user_id),
    CONSTRAINT no_self_connect CHECK (user_id != connected_user_id)
);

-- User blocks
CREATE TABLE IF NOT EXISTS public.user_blocks (
    blocker_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason text,
    blocked_at timestamptz DEFAULT now(),
    
    PRIMARY KEY (blocker_id, blocked_id),
    CONSTRAINT no_self_block CHECK (blocker_id != blocked_id)
);

-- Create indexes for mentorship
CREATE INDEX IF NOT EXISTS idx_mentorship_mentor ON public.mentorship_connections(mentor_id, status);
CREATE INDEX IF NOT EXISTS idx_mentorship_mentee ON public.mentorship_connections(mentee_id, status);
CREATE INDEX IF NOT EXISTS idx_mentorship_status ON public.mentorship_connections(status, requested_at DESC) WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_connection_requests_recipient ON public.connection_requests(recipient_id, status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_connection_requests_requester ON public.connection_requests(requester_id);

CREATE INDEX IF NOT EXISTS idx_user_connections_user ON public.user_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_connected ON public.user_connections(connected_user_id);

CREATE INDEX IF NOT EXISTS idx_user_blocks_blocker ON public.user_blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_user_blocks_blocked ON public.user_blocks(blocked_id);

-- Add comments
COMMENT ON TABLE public.mentorship_connections IS 'Mentorship relationships between mentors and mentees';
COMMENT ON TABLE public.connection_requests IS 'Pending connection requests between users';
COMMENT ON TABLE public.user_connections IS 'Established connections between users';
COMMENT ON TABLE public.user_blocks IS 'Blocked users for privacy and safety';
