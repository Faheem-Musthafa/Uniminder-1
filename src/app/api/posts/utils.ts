// Utility: Role check for alumni
import { Profile } from '@/types';

export function isAlumni(profile: Profile): boolean {
  return profile.role === 'alumni';
}
