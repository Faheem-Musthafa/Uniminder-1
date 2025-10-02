'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Users, 
  Megaphone, 
  HelpCircle, 
  BookOpen,
  Filter 
} from 'lucide-react';

interface PostFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  userRole: 'student' | 'alumni' | 'aspirant' | 'admin';
}

export function PostFilters({ activeFilter, onFilterChange, userRole }: PostFiltersProps) {
  const filterOptions = [
    { 
      key: 'all', 
      label: 'All Posts', 
      icon: Filter,
      description: 'View all posts'
    },
    { 
      key: 'job', 
      label: 'Jobs', 
      icon: Briefcase,
      description: 'Full-time positions'
    },
    { 
      key: 'referral', 
      label: 'Referrals', 
      icon: Users,
      description: 'Employee referrals'
    },
    { 
      key: 'update', 
      label: 'Updates', 
      icon: Megaphone,
      description: 'Company & industry news'
    },
  ];

  // Add role-specific filters
  if (userRole === 'aspirant') {
    filterOptions.push({
      key: 'resource',
      label: 'Resources',
      icon: BookOpen,
      description: 'Study materials & guides'
    });
  }

  if (userRole === 'student' || userRole === 'aspirant') {
    filterOptions.push({
      key: 'question',
      label: 'Q&A',
      icon: HelpCircle,
      description: 'Questions & discussions'
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.key;
          
          return (
            <Button
              key={filter.key}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange(filter.key)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {filter.label}
              {isActive && (
                <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                  Active
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}