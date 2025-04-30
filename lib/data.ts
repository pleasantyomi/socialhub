import type {
  Post,
  Comment,
  MarketplaceItem,
  User,
  TrendingTopic,
  UserProfile,
  Conversation,
  Notification,
} from "./types";

// Mock data for the application
// In a real app, this would come from an API or database

export function getPosts(): Post[] {
  return [
    {
      id: "1",
      author: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Just launched my new website! Check it out and let me know what you think. #webdev #design",
      image: "/placeholder.svg?height=400&width=600",
      timestamp: "2 hours ago",
      likes: 24,
      comments: [
        {
          id: "c1",
          author: {
            name: "Alice Smith",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          content: "Looks amazing! Great work!",
          timestamp: "1 hour ago",
          likes: 5,
        },
        {
          id: "c2",
          author: {
            name: "Bob Johnson",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          content: "The design is so clean and modern. Love it!",
          timestamp: "45 minutes ago",
          likes: 3,
        },
      ],
    },
    {
      id: "2",
      author: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "Beautiful sunset at the beach today! 🌅 #nature #sunset #beach",
      image: "/placeholder.svg?height=400&width=600",
      timestamp: "5 hours ago",
      likes: 56,
      comments: [
        {
          id: "c3",
          author: {
            name: "Mike Wilson",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          content: "Wow, that's gorgeous! Which beach is this?",
          timestamp: "4 hours ago",
          likes: 2,
        },
      ],
    },
    {
      id: "3",
      author: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Just finished reading this amazing book. Highly recommend it to everyone who loves science fiction!",
      timestamp: "1 day ago",
      likes: 18,
      comments: [],
    },
  ];
}

export function getComments(postId: string): Comment[] {
  const post = getPosts().find((p) => p.id === postId);
  return post?.comments || [];
}

export function getTrendingTopics(): TrendingTopic[] {
  return [
    {
      category: "Technology",
      title: "#WebDevelopment",
      posts: 1234,
    },
    {
      category: "Entertainment",
      title: "New Movie Release",
      posts: 982,
    },
    {
      category: "Sports",
      title: "#Olympics2024",
      posts: 2345,
    },
    {
      category: "Business",
      title: "Stock Market Update",
      posts: 567,
    },
  ];
}

export function getSuggestedUsers(): User[] {
  return [
    {
      id: "u1",
      name: "Sarah Parker",
      username: "sarahp",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "u2",
      name: "David Wilson",
      username: "davidw",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "u3",
      name: "Emily Chen",
      username: "emilyc",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];
}

export function getMarketplaceItems(): MarketplaceItem[] {
  return [
    {
      id: "m1",
      title: "iPhone 13 Pro - Excellent Condition",
      price: 699.99,
      image: "/placeholder.svg?height=300&width=300",
      location: "New York",
      listedTime: "2 days ago",
      category: "Electronics",
    },
    {
      id: "m2",
      title: "Vintage Leather Sofa",
      price: 450,
      image: "/placeholder.svg?height=300&width=300",
      location: "Los Angeles",
      listedTime: "1 week ago",
      category: "Furniture",
    },
    {
      id: "m3",
      title: "Mountain Bike - Trek",
      price: 350,
      image: "/placeholder.svg?height=300&width=300",
      location: "Chicago",
      listedTime: "3 days ago",
      category: "Sports",
    },
    {
      id: "m4",
      title: "Canon EOS R5 Camera",
      price: 2100,
      image: "/placeholder.svg?height=300&width=300",
      location: "Miami",
      listedTime: "Just now",
      category: "Electronics",
    },
    {
      id: "m5",
      title: "Designer Handbag",
      price: 180,
      image: "/placeholder.svg?height=300&width=300",
      location: "Seattle",
      listedTime: "5 days ago",
      category: "Fashion",
    },
    {
      id: "m6",
      title: "Gaming PC - High Spec",
      price: 1200,
      image: "/placeholder.svg?height=300&width=300",
      location: "Austin",
      listedTime: "1 day ago",
      category: "Electronics",
    },
  ];
}

export function getUserProfile(): UserProfile {
  return {
    name: "Alex Morgan",
    username: "alexmorgan",
    avatar: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=400&width=1200",
    bio: "Digital creator | Web Developer | Photography enthusiast | Exploring the world one pixel at a time",
    location: "San Francisco, CA",
    website: "https://alexmorgan.com",
    joinDate: "March 2020",
    following: 245,
    followers: 1024,
  };
}

export function getUserPosts(): Post[] {
  return [
    {
      id: "up1",
      author: {
        name: "Alex Morgan",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Just launched my new portfolio website! Check it out and let me know what you think.",
      image: "/placeholder.svg?height=400&width=600",
      timestamp: "2 days ago",
      likes: 45,
      comments: [],
    },
    {
      id: "up2",
      author: {
        name: "Alex Morgan",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Working on a new exciting project. Can't wait to share it with everyone!",
      timestamp: "1 week ago",
      likes: 32,
      comments: [],
    },
    {
      id: "up3",
      author: {
        name: "Alex Morgan",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "Beautiful sunset from my balcony today. #nofilter",
      image: "/placeholder.svg?height=400&width=600",
      timestamp: "2 weeks ago",
      likes: 78,
      comments: [],
    },
  ];
}

export function getUserLikedPosts(): Post[] {
  return [
    {
      id: "lp1",
      author: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Just got back from an amazing trip to Japan! Here are some highlights.",
      image: "/placeholder.svg?height=400&width=600",
      timestamp: "3 days ago",
      likes: 89,
      comments: [],
    },
    {
      id: "lp2",
      author: {
        name: "Mark Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Check out this cool tech gadget I just got. It's a game changer!",
      image: "/placeholder.svg?height=400&width=600",
      timestamp: "5 days ago",
      likes: 56,
      comments: [],
    },
  ];
}

// New functions for messages and notifications

export function getConversations(): Conversation[] {
  return [
    {
      id: "c1",
      user: {
        name: "Sarah Parker",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: true,
        lastSeen: "",
      },
      lastMessage: "That sounds great! Let's meet up tomorrow.",
      lastMessageTime: "10:42 AM",
      unread: true,
      messages: [
        {
          content: "Hey, how are you doing?",
          time: "10:30 AM",
          isMe: false,
        },
        {
          content: "I'm good, thanks! Just working on some new designs.",
          time: "10:32 AM",
          isMe: true,
        },
        {
          content:
            "They look amazing! Would love to catch up and hear more about your projects.",
          time: "10:35 AM",
          isMe: false,
        },
        {
          content:
            "Sure, I'm free tomorrow afternoon if you want to grab coffee?",
          time: "10:40 AM",
          isMe: true,
        },
        {
          content: "That sounds great! Let's meet up tomorrow.",
          time: "10:42 AM",
          isMe: false,
        },
      ],
    },
    {
      id: "c2",
      user: {
        name: "David Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: false,
        lastSeen: "2 hours ago",
      },
      lastMessage: "Did you see the latest update to the project?",
      lastMessageTime: "Yesterday",
      unread: false,
      messages: [
        {
          content: "Hey, did you get a chance to review the documents I sent?",
          time: "Yesterday, 4:30 PM",
          isMe: false,
        },
        {
          content: "Yes, I went through them. Everything looks good!",
          time: "Yesterday, 5:15 PM",
          isMe: true,
        },
        {
          content: "Great! I'll proceed with the next steps then.",
          time: "Yesterday, 5:20 PM",
          isMe: false,
        },
        {
          content: "Did you see the latest update to the project?",
          time: "Yesterday, 6:45 PM",
          isMe: false,
        },
      ],
    },
    {
      id: "c3",
      user: {
        name: "Emily Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: true,
        lastSeen: "",
      },
      lastMessage: "The presentation went really well!",
      lastMessageTime: "2 days ago",
      unread: false,
      messages: [
        {
          content: "How did your presentation go?",
          time: "2 days ago, 2:30 PM",
          isMe: true,
        },
        {
          content: "The presentation went really well!",
          time: "2 days ago, 3:45 PM",
          isMe: false,
        },
      ],
    },
    {
      id: "c4",
      user: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: false,
        lastSeen: "3 days ago",
      },
      lastMessage: "Are we still on for the team lunch next week?",
      lastMessageTime: "3 days ago",
      unread: false,
      messages: [
        {
          content: "Hey team, just checking in about next week's schedule.",
          time: "3 days ago, 10:15 AM",
          isMe: false,
        },
        {
          content: "I should be available most days except Wednesday.",
          time: "3 days ago, 10:30 AM",
          isMe: true,
        },
        {
          content: "Are we still on for the team lunch next week?",
          time: "3 days ago, 11:45 AM",
          isMe: false,
        },
      ],
    },
  ];
}

export function getCurrentConversation(): Conversation | undefined {
  return getConversations()[0];
}

export function getNotifications(): Notification[] {
  return [
    {
      id: "n1",
      user: {
        name: "Sarah Parker",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      type: "like",
      action: "liked your post",
      target: "",
      content:
        "Just launched my new portfolio website! Check it out and let me know what you think.",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: "n2",
      user: {
        name: "David Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      type: "comment",
      action: "commented on your post",
      target: "",
      content:
        "This looks amazing! I'd love to hear more about how you built it.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "n3",
      user: {
        name: "Emily Chen",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      type: "follow",
      action: "started following you",
      target: "",
      content: "",
      time: "3 hours ago",
      read: true,
    },
    {
      id: "n4",
      user: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      type: "mention",
      action: "mentioned you in a comment",
      target: "",
      content:
        "I think @alexmorgan would have some great insights on this topic!",
      time: "Yesterday",
      read: true,
    },
    {
      id: "n5",
      user: {
        name: "Jessica Lee",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      type: "share",
      action: "shared your post",
      target: "",
      content: "Beautiful sunset from my balcony today. #nofilter",
      time: "2 days ago",
      read: true,
    },
  ];
}
