-- Sample Data for Testing UniMinder Dashboards
-- Run this after setting up the schema to populate test data

-- Note: Replace 'your_clerk_user_id' with actual Clerk user IDs from your system

-- ================================================================
-- 1. SAMPLE ALUMNI POSTS (Job Openings & Referrals)
-- ================================================================

-- Sample Job Post 1
INSERT INTO public.posts (
    author_id, 
    type, 
    title, 
    content, 
    company_name, 
    location, 
    salary_range,
    experience_required,
    tags,
    is_active,
    views_count,
    likes_count,
    comments_count,
    created_at
) VALUES (
    'your_alumni_clerk_id', -- Replace with actual alumni user ID
    'job',
    'Senior Software Engineer - Full Stack',
    'We are looking for an experienced full-stack developer to join our growing team. You will work on cutting-edge technologies and solve challenging problems.',
    'TechCorp Solutions',
    'Mumbai, India (Hybrid)',
    '₹15-25 LPA',
    '3-5 years',
    ARRAY['React', 'Node.js', 'TypeScript', 'AWS'],
    true,
    145,
    28,
    12,
    NOW() - INTERVAL '2 days'
);

-- Sample Job Post 2
INSERT INTO public.posts (
    author_id, 
    type, 
    title, 
    content, 
    company_name, 
    location, 
    tags,
    is_active,
    views_count,
    likes_count,
    created_at
) VALUES (
    'your_alumni_clerk_id',
    'job',
    'Frontend Developer - React',
    'Join our team as a React developer. Great learning opportunities and competitive salary.',
    'StartupXYZ',
    'Bangalore, India (Remote)',
    ARRAY['React', 'JavaScript', 'CSS', 'Git'],
    true,
    89,
    15,
    NOW() - INTERVAL '5 days'
);

-- Sample Referral Post
INSERT INTO public.posts (
    author_id, 
    type, 
    title, 
    content, 
    company_name, 
    location, 
    tags,
    is_active,
    views_count,
    likes_count,
    created_at
) VALUES (
    'your_alumni_clerk_id',
    'referral',
    'Referral: Data Scientist at Google',
    'I can refer qualified candidates for a Data Scientist position at Google. Must have strong Python and ML skills. DM for details.',
    'Google',
    'Hyderabad, India',
    ARRAY['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
    true,
    234,
    45,
    NOW() - INTERVAL '1 day'
);

-- Sample Update Post
INSERT INTO public.posts (
    author_id, 
    type, 
    title, 
    content, 
    tags,
    is_active,
    views_count,
    likes_count,
    created_at
) VALUES (
    'your_alumni_clerk_id',
    'update',
    'Career Tips: How to Ace Technical Interviews',
    'Sharing my experience and tips on clearing technical interviews at top companies. Key points: practice DSA, understand system design, and be confident!',
    ARRAY['Career Advice', 'Interviews', 'Tips'],
    true,
    567,
    89,
    NOW() - INTERVAL '3 days'
);

-- ================================================================
-- 2. SAMPLE ASPIRANT RESOURCES
-- ================================================================

-- Sample Resource Post 1
INSERT INTO public.posts (
    author_id, 
    type, 
    title, 
    content, 
    external_url,
    tags,
    is_active,
    views_count,
    likes_count,
    created_at
) VALUES (
    'your_alumni_clerk_id',
    'resource',
    'Complete Web Development Roadmap 2025',
    'A comprehensive guide to learning web development from scratch. Covers HTML, CSS, JavaScript, React, and backend technologies.',
    'https://roadmap.sh/frontend',
    ARRAY['Web Development', 'Learning', 'Roadmap', 'Frontend'],
    true,
    423,
    67,
    NOW() - INTERVAL '4 days'
);

-- Sample Question Post
INSERT INTO public.posts (
    author_id, 
    type, 
    title, 
    content, 
    tags,
    is_active,
    views_count,
    comments_count,
    created_at
) VALUES (
    'your_aspirant_clerk_id', -- Replace with aspirant user ID
    'question',
    'Best way to prepare for JEE Advanced?',
    'I am currently in 12th grade and planning to take JEE Advanced. What are the best study strategies and resources? Any tips from those who have cleared it?',
    ARRAY['JEE', 'Exam Preparation', 'Study Tips'],
    true,
    156,
    23,
    NOW() - INTERVAL '6 hours'
);

-- ================================================================
-- 3. SAMPLE POST INTERACTIONS (Bookmarks, Applications, Likes)
-- ================================================================

-- Student bookmarking job posts
INSERT INTO public.post_interactions (post_id, user_id, interaction_type, created_at)
VALUES 
    (1, 'your_student_clerk_id', 'bookmark', NOW() - INTERVAL '1 day'),
    (2, 'your_student_clerk_id', 'bookmark', NOW() - INTERVAL '2 days'),
    (3, 'your_student_clerk_id', 'bookmark', NOW() - INTERVAL '3 days');

-- Student applying to jobs
INSERT INTO public.post_interactions (post_id, user_id, interaction_type, created_at)
VALUES 
    (1, 'your_student_clerk_id', 'apply', NOW() - INTERVAL '1 day'),
    (2, 'your_student_clerk_id', 'apply', NOW() - INTERVAL '5 days');

-- Students liking posts
INSERT INTO public.post_interactions (post_id, user_id, interaction_type, created_at)
VALUES 
    (1, 'your_student_clerk_id', 'like', NOW() - INTERVAL '2 days'),
    (4, 'your_student_clerk_id', 'like', NOW() - INTERVAL '3 days');

-- Aspirant bookmarking resources
INSERT INTO public.post_interactions (post_id, user_id, interaction_type, created_at)
VALUES 
    (5, 'your_aspirant_clerk_id', 'bookmark', NOW() - INTERVAL '4 days'),
    (6, 'your_aspirant_clerk_id', 'bookmark', NOW() - INTERVAL '2 days');

-- ================================================================
-- 4. SAMPLE CONVERSATIONS & MESSAGES
-- ================================================================

-- Create a conversation between student and alumni
INSERT INTO public.conversations (id, type, created_by, is_active, created_at)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'direct', 'your_student_clerk_id', true, NOW() - INTERVAL '5 days');

-- Add participants to conversation
INSERT INTO public.conversation_participants (conversation_id, user_id, joined_at)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'your_student_clerk_id', NOW() - INTERVAL '5 days'),
    ('550e8400-e29b-41d4-a716-446655440001', 'your_alumni_clerk_id', NOW() - INTERVAL '5 days');

-- Add messages to conversation
INSERT INTO public.messages (conversation_id, sender_id, content, created_at)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'your_student_clerk_id', 
     'Hi! I saw your job post for the Full Stack position. Could you tell me more about the role?', 
     NOW() - INTERVAL '4 days'),
    
    ('550e8400-e29b-41d4-a716-446655440001', 'your_alumni_clerk_id', 
     'Sure! It is a great opportunity. The role involves working with React and Node.js on our main product. What is your experience?', 
     NOW() - INTERVAL '4 days'),
    
    ('550e8400-e29b-41d4-a716-446655440001', 'your_student_clerk_id', 
     'I have 1 year of internship experience with React and am learning Node.js. Would that be sufficient?', 
     NOW() - INTERVAL '3 days'),
    
    ('550e8400-e29b-41d4-a716-446655440001', 'your_alumni_clerk_id', 
     'That sounds good! I can refer you. Can you send me your resume?', 
     NOW() - INTERVAL '2 hours');

-- Create another conversation (aspirant and alumni)
INSERT INTO public.conversations (id, type, created_by, is_active, created_at)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440002', 'direct', 'your_aspirant_clerk_id', true, NOW() - INTERVAL '3 days');

-- Add participants
INSERT INTO public.conversation_participants (conversation_id, user_id, joined_at)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440002', 'your_aspirant_clerk_id', NOW() - INTERVAL '3 days'),
    ('550e8400-e29b-41d4-a716-446655440002', 'your_alumni_clerk_id', NOW() - INTERVAL '3 days');

-- Add messages
INSERT INTO public.messages (conversation_id, sender_id, content, created_at)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440002', 'your_aspirant_clerk_id', 
     'Hello! I am preparing for college admissions. Can you guide me about the admission process?', 
     NOW() - INTERVAL '3 days'),
    
    ('550e8400-e29b-41d4-a716-446655440002', 'your_alumni_clerk_id', 
     'Of course! I would be happy to help. What are you interested in studying?', 
     NOW() - INTERVAL '1 hour');

-- ================================================================
-- 5. SAMPLE POST COMMENTS
-- ================================================================

-- Comments on job post
INSERT INTO public.post_comments (post_id, author_id, content, created_at)
VALUES 
    (1, 'your_student_clerk_id', 'This looks like a great opportunity! Is remote work possible?', NOW() - INTERVAL '1 day'),
    (1, 'your_alumni_clerk_id', 'Yes, we offer hybrid work model - 3 days office, 2 days remote.', NOW() - INTERVAL '1 day'),
    (1, 'user_2', 'What is the interview process like?', NOW() - INTERVAL '12 hours');

-- Comments on resource post
INSERT INTO public.post_comments (post_id, author_id, content, created_at)
VALUES 
    (5, 'your_student_clerk_id', 'This roadmap is super helpful! Thanks for sharing.', NOW() - INTERVAL '3 days'),
    (5, 'your_aspirant_clerk_id', 'Bookmarked! Will follow this guide.', NOW() - INTERVAL '2 days');

-- ================================================================
-- 6. UPDATE PROFILE DATA FOR TESTING
-- ================================================================

-- Update student profile with skills and interests
UPDATE public.profiles
SET 
    skills = ARRAY['React', 'TypeScript', 'Python', 'Node.js'],
    interests = ARRAY['Web Development', 'Machine Learning', 'Open Source'],
    looking_for = ARRAY['Internships', 'Full-time Jobs', 'Mentorship'],
    bio = 'Computer Science student passionate about full-stack development and AI.'
WHERE user_id = 'your_student_clerk_id';

-- Update alumni profile
UPDATE public.profiles
SET 
    skills = ARRAY['React', 'Node.js', 'AWS', 'System Design', 'Leadership'],
    company = 'TechCorp Solutions',
    designation = 'Senior Software Engineer',
    years_of_experience = 5,
    bio = 'Senior engineer with 5 years experience. Love mentoring and helping students.'
WHERE user_id = 'your_alumni_clerk_id';

-- Update aspirant profile
UPDATE public.profiles
SET 
    interests = ARRAY['Engineering', 'Web Development', 'Entrepreneurship'],
    looking_for = ARRAY['College Guidance', 'Career Advice', 'Study Resources'],
    entrance_exam = 'JEE Advanced',
    target_college = 'IIT Bombay',
    bio = '12th grade student preparing for JEE and passionate about technology.'
WHERE user_id = 'your_aspirant_clerk_id';

-- ================================================================
-- 7. VERIFICATION QUERIES
-- ================================================================

-- Check total posts
-- SELECT type, COUNT(*) FROM public.posts GROUP BY type;

-- Check interactions
-- SELECT interaction_type, COUNT(*) FROM public.post_interactions GROUP BY interaction_type;

-- Check conversations and messages
-- SELECT c.id, COUNT(m.id) as message_count 
-- FROM public.conversations c 
-- LEFT JOIN public.messages m ON c.id = m.conversation_id 
-- GROUP BY c.id;

-- Check profile data
-- SELECT role, COUNT(*) FROM public.profiles GROUP BY role;

-- ================================================================
-- NOTES:
-- ================================================================
-- 1. Replace all 'your_*_clerk_id' with actual Clerk user IDs
-- 2. Replace post_id numbers (1, 2, 3...) with actual IDs after inserting posts
-- 3. Run verification queries to check data was inserted correctly
-- 4. Adjust timestamps as needed using INTERVAL modifications
-- 5. This creates a realistic test environment with:
--    - 6 posts (2 jobs, 1 referral, 1 update, 1 resource, 1 question)
--    - Multiple interactions (bookmarks, applications, likes)
--    - 2 conversations with messages
--    - Comments on posts
--    - Updated profile data
