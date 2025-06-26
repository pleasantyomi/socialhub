import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createApiResponse, getPaginationParams, validateUser } from '@/lib/api-utils';
import { getPosts as getSupabasePosts, createPost as createSupabasePost } from '@/lib/supabase';

const postSchema = z.object({
  content: z.string().min(1).max(500),
  image: z.string().url().optional(),
});

// Rich Nigerian university demo data
const demoPostsData = [
  {
    id: "1",
    author_id: "unilag_student",
    content: "Just finished my final year project presentation at UNILAG! 🎓 The future of Nigerian tech starts here. #UNILAG #TechInNigeria #FinalYear",
    image: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    profiles: {
      id: "unilag_student",
      username: "chioma_tech",
      full_name: "Chioma Okafor",
      avatar_url: "/placeholder.svg",
      website: null,
      bio: "Computer Science Student at UNILAG",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    likes: [{id: "1", profile_id: "user1", post_id: "1", created_at: new Date().toISOString()}],
    comments: [{id: "1", post_id: "1", author_id: "user2", content: "Congratulations! 🎉", created_at: new Date().toISOString(), profiles: {id: "user2", username: "friend", full_name: "Friend", avatar_url: "/placeholder.svg", bio: null, website: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString()}}]
  },
  {
    id: "2", 
    author_id: "unn_prof",
    content: "Excited to announce our new research collaboration between UNN and international partners on renewable energy solutions for rural Nigerian communities. This is the future! 🌱⚡ #UNN #Research #RenewableEnergy #Nigeria",
    image: null,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    profiles: {
      id: "unn_prof",
      username: "prof_adaora",
      full_name: "Prof. Adaora Okonkwo",
      avatar_url: "/placeholder.svg",
      website: "https://unn.edu.ng",
      bio: "Professor of Engineering, UNN",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    likes: [{id: "2", profile_id: "user1", post_id: "2", created_at: new Date().toISOString()}, {id: "3", profile_id: "user3", post_id: "2", created_at: new Date().toISOString()}],
    comments: []
  },
  {
    id: "3",
    author_id: "ui_student", 
    content: "UI Student Union elections coming up! Time to make our voices heard. Democracy starts on campus 🗳️ #UI #StudentUnion #Elections #Ibadan",
    image: null,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    profiles: {
      id: "ui_student",
      username: "kemi_leader",
      full_name: "Kemi Adebayo",
      avatar_url: "/placeholder.svg",
      website: null,
      bio: "Political Science Student, UI",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    likes: [],
    comments: [{id: "2", post_id: "3", author_id: "user4", content: "Count me in! 💪", created_at: new Date().toISOString(), profiles: {id: "user4", username: "activist", full_name: "Student Activist", avatar_url: "/placeholder.svg", bio: null, website: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString()}}]
  }
];

// In-memory storage for new posts
let newPosts: any[] = [];

// GET posts feed
export async function GET(request: Request) {
  try {
    const session = await validateUser();
    
    // Try to get from database first, fallback to demo data
    try {
      const dbPosts = await getSupabasePosts({ page: 1, limit: 50 });
      if (dbPosts && dbPosts.length > 0) {
        // Combine database posts with new posts and demo data
        return createApiResponse({
          data: [...newPosts, ...dbPosts, ...demoPostsData],
          status: 200,
        });
      }
    } catch (dbError) {
      console.log('Database not available, using demo data');
    }

    // Fallback to demo data + new posts
    return createApiResponse({
      data: [...newPosts, ...demoPostsData],
      status: 200,
    });
  } catch (error) {
    console.error('Error in GET /api/posts:', error);
    return createApiResponse({
      error: 'Failed to fetch posts',
      status: 500,
    });
  }
}

// CREATE new post
export async function POST(request: Request) {
  try {
    const session = await validateUser();
    const json = await request.json();
    
    const validatedData = postSchema.parse(json);
    
    const newPost = {
      id: `post-${Date.now()}`,
      author_id: session.user.id,
      content: validatedData.content,
      image: validatedData.image || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profiles: {
        id: session.user.id,
        username: session.user.name || session.user.email?.split('@')[0] || 'User',
        full_name: session.user.name || '',
        avatar_url: session.user.image || "/placeholder.svg",
        website: null,
        bio: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      likes: [],
      comments: []
    };

    // Try to save to database first
    try {
      const dbPost = await createSupabasePost({
        author_id: session.user.id,
        content: validatedData.content,
        image: validatedData.image || null
      });
      
      if (dbPost) {
        return createApiResponse({
          data: dbPost,
          status: 201,
        });
      }
    } catch (dbError) {
      console.log('Database not available, storing in memory');
    }

    // Fallback to in-memory storage
    newPosts.unshift(newPost);

    return createApiResponse({
      data: newPost,
      status: 201,
    });
  } catch (error) {
    console.error('Error in POST /api/posts:', error);
    if (error instanceof z.ZodError) {
      return createApiResponse({
        error: 'Invalid post data',
        data: error.errors,
        status: 400,
      });
    }

    return createApiResponse({
      error: 'Failed to create post',
      status: 500,
    });
  }
}
