import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { getSupabase } from '@/lib/supabase';
import { PostsFeed } from '@/components/posts/posts-feed';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarTrigger, SidebarProvider } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default async function PostsPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  const supabase = getSupabase();
  
  // Check if user profile exists and is onboarded
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.onboarded) {
    redirect('/onboarding');
  }

  // Fetch posts from the database
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles!posts_author_id_fkey(
        id,
        full_name,
        avatar_url,
        role,
        company,
        designation
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <SidebarProvider>
      <AppSidebar profile={profile} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {profile.role === 'alumni' ? 'My Posts' : 
                     profile.role === 'student' ? 'Job Posts' : 'Resources'}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex-1 space-y-4 p-4 pt-0">
          <PostsFeed posts={posts || []} currentUser={profile} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}