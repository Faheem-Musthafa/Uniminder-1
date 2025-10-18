// Zod schemas for post validation
import { z } from 'zod';

export const PostTypeEnum = z.enum(['job', 'referral', 'update', 'question', 'resource']);

export const createPostSchema = z.object({
  type: PostTypeEnum,
  title: z.string().min(5).max(120),
  content: z.string().min(10),
  external_url: z.string().url().optional(),
  company_name: z.string().optional(),
  location: z.string().optional(),
  salary_range: z.string().optional(),
  experience_required: z.string().optional(),
  skills_required: z.array(z.string()).optional(),
  job_type: z.string().optional(),
  tags: z.array(z.string()).optional(),
  is_featured: z.boolean().optional(),
});

export const updatePostSchema = createPostSchema.partial();
