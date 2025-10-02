'use client';

import { useState } from 'react';
import { Post, Profile } from '@/types';
import { PostCard } from './post-card';
import { PostFilters } from './post-filters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface PostsFeedProps {
  posts: Post[];
  currentUser: Profile;
}

export function PostsFeed({ posts, currentUser }: PostsFeedProps) {
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.type === filter));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {currentUser.role === 'alumni' ? 'My Posts' : 
             currentUser.role === 'student' ? 'Job Opportunities' : 'Resources'}
          </h1>
          <p className="text-muted-foreground">
            {currentUser.role === 'alumni' ? 'Share opportunities with students' :
             currentUser.role === 'student' ? 'Discover jobs and referrals from alumni' :
             'Find resources and guidance from the community'}
          </p>
        </div>
        
        {currentUser.role === 'alumni' && (
          <Button asChild>
            <Link href="/posts/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <PostFilters 
        activeFilter={activeFilter} 
        onFilterChange={handleFilterChange}
        userRole={currentUser.role}
      />

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              currentUser={currentUser}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg">
              {activeFilter === 'all' ? 'No posts yet' : `No ${activeFilter} posts yet`}
            </div>
            {currentUser.role === 'alumni' && (
              <Button asChild className="mt-4">
                <Link href="/posts/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Post
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}