'use client';

import { Post, Profile } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  ExternalLink,
  MapPin,
  Building,
  Calendar,
  DollarSign
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
  currentUser: Profile;
}

export function PostCard({ post, currentUser }: PostCardProps) {
  const author = post.author;
  
  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'job': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'referral': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'update': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'question': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'resource': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={author?.avatar_url} />
              <AvatarFallback>
                {author?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{author?.full_name || 'Unknown User'}</p>
                <Badge variant="secondary" className="text-xs">
                  {author?.role || 'User'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {author?.designation && author?.company 
                  ? `${author.designation} at ${author.company}`
                  : author?.company || 'Professional'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getPostTypeColor(post.type)}>
              {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
          <p className="text-muted-foreground">{post.content}</p>
        </div>

        {/* Job-specific details */}
        {post.type === 'job' && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {post.company_name && (
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>{post.company_name}</span>
                </div>
              )}
              {post.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{post.location}</span>
                </div>
              )}
              {post.salary_range && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{post.salary_range}</span>
                </div>
              )}
              {post.experience_required && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{post.experience_required}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Heart className="h-4 w-4 mr-1" />
              {post.likes_count || 0}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.comments_count || 0}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {post.external_url && (
              <Button asChild size="sm" variant="outline">
                <Link href={post.external_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Apply
                </Link>
              </Button>
            )}
            {currentUser.role === 'student' && post.type === 'job' && (
              <Button size="sm">
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}