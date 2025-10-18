-- ============================================
-- UniMinder Sample Data
-- Load this after setting up the schema
-- ============================================

-- Note: Replace user_id values with actual Clerk user IDs in production

-- Sample admin user
INSERT INTO public.profiles (id, user_id, email, role, full_name, location, onboarded, is_verified, is_active)
VALUES 
('admin-001', 'admin-001', 'admin@uniminder.com', 'admin', 'Admin User', 'Mumbai, India', true, true, true)
ON CONFLICT (id) DO NOTHING;

-- Sample students
INSERT INTO public.profiles (
    id, user_id, email, role, full_name, location, college, degree, branch, passing_year,
    skills, interests, looking_for, bio, onboarded, is_active
)
VALUES 
(
    'student-001', 'student-001', 'john.doe@student.com', 'student',
    'John Doe', 'Mumbai, India',
    'Indian Institute of Technology, Mumbai', 'Bachelor of Technology', 'Computer Science', '2026',
    ARRAY['JavaScript', 'React', 'Node.js', 'Python'],
    ARRAY['Web Development', 'Machine Learning', 'Open Source'],
    ARRAY['Internships', 'Projects', 'Mentorship'],
    'Computer Science student passionate about web development and AI.',
    true, true
),
(
    'student-002', 'student-002', 'jane.smith@student.com', 'student',
    'Jane Smith', 'Delhi, India',
    'Delhi Technological University', 'Bachelor of Technology', 'Electronics', '2025',
    ARRAY['C++', 'Embedded Systems', 'IoT'],
    ARRAY['Robotics', 'Hardware', 'Innovation'],
    ARRAY['Internships', 'Research Opportunities'],
    'Electronics enthusiast interested in IoT and embedded systems.',
    true, true
)
ON CONFLICT (id) DO NOTHING;

-- Sample alumni
INSERT INTO public.profiles (
    id, user_id, email, role, full_name, location, college, degree, branch, passing_year,
    company, designation, years_of_experience, skills, interests, mentorship_areas,
    bio, onboarded, is_verified, is_active
)
VALUES 
(
    'alumni-001', 'alumni-001', 'mike.johnson@alumni.com', 'alumni',
    'Mike Johnson', 'Bangalore, India',
    'Indian Institute of Technology, Mumbai', 'Bachelor of Technology', 'Computer Science', '2018',
    'Google', 'Senior Software Engineer', 6,
    ARRAY['Python', 'Go', 'Kubernetes', 'System Design'],
    ARRAY['Distributed Systems', 'Cloud Computing', 'Mentorship'],
    ARRAY['Career Guidance', 'Technical Interview Prep', 'System Design'],
    'Senior engineer at Google, passionate about helping students navigate tech careers.',
    true, true, true
),
(
    'alumni-002', 'alumni-002', 'sarah.williams@alumni.com', 'alumni',
    'Sarah Williams', 'Pune, India',
    'Pune Institute of Technology', 'Bachelor of Technology', 'Computer Science', '2019',
    'Microsoft', 'Software Development Engineer', 5,
    ARRAY['C#', '.NET', 'Azure', 'React'],
    ARRAY['Cloud Development', 'Full Stack', 'Mentoring'],
    ARRAY['Full Stack Development', 'Career Transition', 'Interview Skills'],
    'Full-stack developer at Microsoft, helping students land their dream jobs.',
    true, true, true
)
ON CONFLICT (id) DO NOTHING;

-- Sample aspirants
INSERT INTO public.profiles (
    id, user_id, email, role, full_name, location, entrance_exam, target_college,
    skills, interests, looking_for, bio, onboarded, phone_verified, is_active
)
VALUES 
(
    'aspirant-001', 'aspirant-001', 'rahul.kumar@aspirant.com', 'aspirant',
    'Rahul Kumar', 'Kota, India',
    'JEE Advanced', 'IIT Bombay',
    ARRAY['Physics', 'Chemistry', 'Mathematics'],
    ARRAY['JEE Preparation', 'Problem Solving', 'Study Groups'],
    ARRAY['Study Materials', 'Mentorship', 'Tips'],
    'JEE aspirant targeting IIT Bombay, looking for guidance and study resources.',
    true, true, true
),
(
    'aspirant-002', 'aspirant-002', 'priya.sharma@aspirant.com', 'aspirant',
    'Priya Sharma', 'Pune, India',
    'CAT', 'IIM Ahmedabad',
    ARRAY['Quantitative Aptitude', 'Verbal Ability', 'Logical Reasoning'],
    ARRAY['Management', 'Business', 'Leadership'],
    ARRAY['Study Groups', 'Mock Tests', 'Career Advice'],
    'CAT aspirant preparing for IIM admission, eager to connect with MBA students and alumni.',
    true, true, true
)
ON CONFLICT (id) DO NOTHING;

-- Sample posts
INSERT INTO public.posts (author_id, type, title, content, company_name, location, tags, is_active)
VALUES 
(
    'alumni-001',
    'job',
    'Software Engineer - Backend (2-3 years exp)',
    'Google is hiring backend engineers. Looking for candidates with strong system design skills and experience with distributed systems. Referrals available!',
    'Google',
    'Bangalore, India',
    ARRAY['Backend', 'System Design', 'Go', 'Kubernetes'],
    true
),
(
    'alumni-002',
    'referral',
    'Microsoft Internship Referral - Summer 2026',
    'Hey students! I can refer for Microsoft internships. Drop your resume and I''ll forward it to the recruiters. Preference for strong DSA skills.',
    'Microsoft',
    'Remote',
    ARRAY['Internship', 'DSA', 'C#', 'Azure'],
    true
),
(
    'student-001',
    'question',
    'Best resources for learning React?',
    'I''m starting with React and looking for comprehensive resources. What do you recommend for beginners? Any good projects to build?',
    NULL,
    NULL,
    ARRAY['React', 'Web Development', 'Learning'],
    true
),
(
    'alumni-001',
    'update',
    'Tips for cracking Google interviews',
    'Just completed my 3rd year at Google. Here are my top tips for interview prep: 1) Focus on fundamentals 2) Practice system design 3) Mock interviews are crucial 4) Don''t ignore behavioral rounds. Happy to answer questions!',
    NULL,
    NULL,
    ARRAY['Interview Tips', 'Google', 'Career Advice'],
    true
)
ON CONFLICT DO NOTHING;

-- Sample connections
INSERT INTO public.user_connections (user_id, connected_user_id)
VALUES 
('student-001', 'alumni-001'),
('student-001', 'student-002'),
('alumni-001', 'alumni-002')
ON CONFLICT DO NOTHING;

-- Sample mentorship connections
INSERT INTO public.mentorship_connections (mentor_id, mentee_id, status, message, accepted_at)
VALUES 
(
    'alumni-001',
    'student-001',
    'accepted',
    'Hi! I''m interested in learning about careers in system design and distributed systems. Would love your guidance!',
    now()
),
(
    'alumni-002',
    'student-002',
    'pending',
    'Hello! I''m looking for guidance on full-stack development and career advice for breaking into big tech.',
    NULL
)
ON CONFLICT DO NOTHING;

-- Sample notifications
INSERT INTO public.notifications (user_id, type, title, content, is_read, channel, status)
VALUES 
(
    'student-001',
    'mentorship_accepted',
    'Mentorship Request Accepted',
    'Mike Johnson accepted your mentorship request!',
    false,
    'in_app',
    'delivered'
),
(
    'student-002',
    'post_comment',
    'New Comment on Your Post',
    'Sarah Williams commented on your post about React resources.',
    false,
    'in_app',
    'delivered'
),
(
    'alumni-001',
    'mentorship_request',
    'New Mentorship Request',
    'Jane Smith sent you a mentorship request.',
    false,
    'in_app',
    'delivered'
)
ON CONFLICT DO NOTHING;

-- Sample user preferences
INSERT INTO public.user_preferences (user_id, email_notifications, push_notifications, notification_frequency, privacy_level)
VALUES 
('student-001', true, true, 'instant', 'public'),
('student-002', true, true, 'daily', 'public'),
('alumni-001', true, false, 'instant', 'public'),
('alumni-002', true, true, 'daily', 'connections'),
('aspirant-001', true, true, 'instant', 'public')
ON CONFLICT DO NOTHING;

-- Add some post interactions
INSERT INTO public.post_interactions (post_id, user_id, interaction_type)
SELECT id, 'student-001', 'like'
FROM public.posts
WHERE author_id = 'alumni-001'
LIMIT 2
ON CONFLICT DO NOTHING;

INSERT INTO public.post_interactions (post_id, user_id, interaction_type)
SELECT id, 'student-002', 'bookmark'
FROM public.posts
WHERE type = 'referral'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Sample comments
INSERT INTO public.post_comments (post_id, author_id, content)
SELECT 
    p.id,
    'student-002',
    'This is really helpful! Thanks for sharing.'
FROM public.posts p
WHERE p.author_id = 'alumni-001'
LIMIT 1
ON CONFLICT DO NOTHING;

COMMENT ON TABLE public.profiles IS 'Sample data loaded - ready for testing';
