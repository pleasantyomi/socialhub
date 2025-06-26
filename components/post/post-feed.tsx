"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  BookmarkIcon,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Loader2,
} from "lucide-react";
import { getPosts, createPost, likePost, unlikePost } from "@/lib/data";
import { withDatabaseFallback } from "@/lib/db-utils";
import { useSession } from "next-auth/react";
import { Post } from "@/lib/types";
import { toast } from "sonner";

// Demo data as fallback - Nigerian University themed
const demoData: Post[] = [
  {
    id: "1",
    author_id: "unilag_student",
    content: "Just finished my final year project presentation at UNILAG! 🎓 The future of Nigerian tech starts here. #UNILAG #TechInNigeria #FinalYear",
    image: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
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
    comments: [{id: "1", post_id: "1", author_id: "user2", content: "Congratulations! 🎉", created_at: new Date().toISOString(), updated_at: new Date().toISOString(), profiles: {id: "user2", username: "friend", full_name: "Friend", avatar_url: "/placeholder.svg", bio: null, website: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString()}}]
  },
  {
    id: "2",
    author_id: "unn_prof",
    content: "Excited to announce our new research collaboration between UNN and international partners on renewable energy solutions for rural Nigerian communities. This is the future! 🌱⚡ #UNN #Research #RenewableEnergy #Nigeria",
    image: null,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
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
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
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
    comments: [{id: "2", post_id: "3", author_id: "user4", content: "Count me in! 💪", created_at: new Date().toISOString(), updated_at: new Date().toISOString(), profiles: {id: "user4", username: "activist", full_name: "Student Activist", avatar_url: "/placeholder.svg", bio: null, website: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString()}}]
  },
  {
    id: "4",
    author_id: "covenant_student",
    content: "Amazing guest lecture today on entrepreneurship in Nigeria! The speaker shared incredible insights about building startups in Lagos. Feeling inspired! 💡🚀 #Covenant #Entrepreneurship #Lagos #Startup",
    image: null,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    profiles: {
      id: "covenant_student",
      username: "emeka_entrepreneur",
      full_name: "Emeka Nwosu",
      avatar_url: "/placeholder.svg",
      website: null,
      bio: "Business Admin Student, Covenant University",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    likes: [{id: "4", profile_id: "user5", post_id: "4", created_at: new Date().toISOString()}],
    comments: []
  },
  {
    id: "5",
    author_id: "abu_researcher",
    content: "Our agriculture research team at ABU just published findings on drought-resistant crops for Northern Nigeria. Climate change solutions starting from our campus! 🌾🔬 #ABU #Agriculture #Research #ClimateChange",
    image: null,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    profiles: {
      id: "abu_researcher",
      username: "dr_hassan",
      full_name: "Dr. Hassan Muhammad",
      avatar_url: "/placeholder.svg",
      website: "https://abu.edu.ng",
      bio: "Agricultural Researcher, ABU Zaria",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    likes: [{id: "5", profile_id: "user6", post_id: "5", created_at: new Date().toISOString()}, {id: "6", profile_id: "user7", post_id: "5", created_at: new Date().toISOString()}],
    comments: [{id: "3", post_id: "5", author_id: "user8", content: "This is groundbreaking! 🙌", created_at: new Date().toISOString(), updated_at: new Date().toISOString(), profiles: {id: "user8", username: "farmer", full_name: "Future Farmer", avatar_url: "/placeholder.svg", bio: null, website: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString()}}]
  },
  {
    id: "6",
    author_id: "uniben_student",
    content: "Medical students at UNIBEN organizing free health screenings for the local community this weekend! Healthcare for all 🏥❤️ #UNIBEN #Medicine #CommunityService #Healthcare",
    image: null,
    created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    updated_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    profiles: {
      id: "uniben_student",
      username: "blessing_medic",
      full_name: "Blessing Osaze",
      avatar_url: "/placeholder.svg",
      website: null,
      bio: "Medical Student, University of Benin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    likes: [{id: "7", profile_id: "user9", post_id: "6", created_at: new Date().toISOString()}],
    comments: []
  },
  {
    id: "7",
    author_id: "futa_tech",
    content: "FUTA robotics team just won the West African University Tech Competition! Nigerian ingenuity at its finest 🤖🏆 #FUTA #Robotics #TechCompetition #WestAfrica",
    image: null,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    profiles: {
      id: "futa_tech",
      username: "tunde_robotics",
      full_name: "Tunde Ajayi",
      avatar_url: "/placeholder.svg",
      website: "https://futa.edu.ng",
      bio: "Robotics Engineer, FUTA",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    likes: [{id: "8", profile_id: "user10", post_id: "7", created_at: new Date().toISOString()}, {id: "9", profile_id: "user11", post_id: "7", created_at: new Date().toISOString()}, {id: "10", profile_id: "user12", post_id: "7", created_at: new Date().toISOString()}],
    comments: [{id: "4", post_id: "7", author_id: "user13", content: "So proud! 🇳🇬", created_at: new Date().toISOString(), updated_at: new Date().toISOString(), profiles: {id: "user13", username: "proud_nigerian", full_name: "Proud Nigerian", avatar_url: "/placeholder.svg", bio: null, website: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString()}}]
  },
  {
    id: "8",
    author_id: "oau_artist",
    content: "OAU Arts Festival this weekend! Celebrating Nigerian culture through music, dance, and visual arts. Come through! 🎭🎵 #OAU #ArtsFestival #NigerianCulture #IleIfe",
    image: null,
    created_at: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), // 30 hours ago
    updated_at: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    profiles: {
      id: "oau_artist",
      username: "funmi_arts",
      full_name: "Funmi Adeyemi",
      avatar_url: "/placeholder.svg",
      website: null,
      bio: "Fine Arts Student, OAU",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    likes: [{id: "11", profile_id: "user14", post_id: "8", created_at: new Date().toISOString()}],
    comments: []
  }
];

export default function PostFeed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>(demoData);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [session]);

  async function loadPosts() {
    try {
      setLoading(true);
      const fetchedPosts = await withDatabaseFallback(
        () => getPosts(),
        demoData,
        'fetch posts'
      );
      setPosts(Array.isArray(fetchedPosts) ? fetchedPosts : demoData);
    } catch (error) {
      console.error('Failed to load posts:', error);
      toast.error("Failed to load posts. Using demo data instead.");
      setPosts(demoData);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePost() {
    if (!session?.user?.id || !newPostContent.trim()) {
      toast.error("Please sign in to create posts");
      return;
    }
    
    setIsPosting(true);
    try {
      const newPost = await withDatabaseFallback(
        () => createPost(session.user.id, newPostContent.trim()),
        {
          id: `local_${Date.now()}`,
          author_id: session.user.id,
          content: newPostContent.trim(),
          image: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          profiles: {
            id: session.user.id,
            username: session.user.name || session.user.email?.split('@')[0] || 'User',
            full_name: session.user.name || session.user.email?.split('@')[0] || 'User',
            avatar_url: session.user.image || "/placeholder.svg",
            website: null,
            bio: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          likes: [],
          comments: []
        },
        'create post'
      );
      
      // Add the new post to the beginning of the list with proper structure
      const formattedPost = {
        ...newPost,
        profiles: newPost.profiles || {
          id: session.user.id,
          username: session.user.name || session.user.email?.split('@')[0] || 'User',
          full_name: session.user.name || session.user.email?.split('@')[0] || 'User',
          avatar_url: session.user.image || "/placeholder.svg",
          website: null,
          bio: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        likes: newPost.likes || [],
        comments: newPost.comments || []
      };
      setPosts([formattedPost, ...posts]);
      setNewPostContent("");
      toast.success("Post created successfully!");
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  }

  async function handleLike(postId: string) {
    if (!session?.user?.id) {
      toast.error("Please sign in to like posts");
      return;
    }

    try {
      const userId = session.user.id;
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const isLiked = post.likes.some(like => like.profile_id === userId);
      
      if (isLiked) {
        await withDatabaseFallback(
          () => unlikePost(postId, userId),
          undefined,
          'unlike post'
        );
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              likes: p.likes.filter(like => like.profile_id !== userId)
            };
          }
          return p;
        }));
      } else {
        const newLike = await withDatabaseFallback(
          () => likePost(postId, userId),
          {
            id: `like_${Date.now()}`,
            profile_id: userId,
            post_id: postId,
            created_at: new Date().toISOString()
          },
          'like post'
        );
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              likes: [...p.likes, newLike]
            };
          }
          return p;
        }));
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      toast.error("Failed to like post. Please try again.");
    }
  }

  const safePosts = Array.isArray(posts) ? posts : [];

  if (!session) {
    return (
      <div className="space-y-6 pt-6">
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">Please sign in to view and create posts</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Avatar>
            <AvatarImage 
              src={session?.user?.image || "/placeholder.svg"} 
              alt={session?.user?.name || "User"} 
              className="h-full w-full object-cover object-center"
            />
            <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="resize-none"
              disabled={!session}
            />
          </div>
        </CardHeader>
        <CardFooter className="flex justify-between p-4">
          <Button
            variant="default"
            onClick={handleCreatePost}
            disabled={isPosting || !session || !newPostContent.trim()}
          >
            {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post
          </Button>
        </CardFooter>
      </Card>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div>
          {safePosts.map((post) => (
            <Card key={post.id} className="mb-4">
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <Avatar>
                  <AvatarImage
                    src={post.profiles.avatar_url || "/placeholder.svg"}
                    alt={post.profiles.full_name || post.profiles.username}
                    className="h-full w-full object-cover object-center"
                  />
                  <AvatarFallback>
                    {post.profiles.full_name?.[0] || post.profiles.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link href={`/profile/${post.profiles.id}`} className="font-semibold hover:underline">
                        {post.profiles.full_name || post.profiles.username}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p>{post.content}</p>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-4">
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleLike(post.id)}
                    className={
                      session?.user?.id && post.likes.some(like => like.profile_id === session.user.id)
                        ? "text-red-500"
                        : ""
                    }
                  >
                    <Heart className="h-4 w-4" />
                    <span className="ml-2">{post.likes.length}</span>
                  </Button>
                  <Link href={`/post/${post.id}`}>
                    <Button variant="ghost" size="icon">
                      <MessageCircle className="h-4 w-4" />
                      <span className="ml-2">{post.comments.length}</span>
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <BookmarkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
