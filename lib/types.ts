export interface User {
    id: string
    name: string
    username: string
    avatar: string
  }
  
  export interface Author {
    name: string
    avatar: string
  }
  
  export interface Comment {
    id: string
    author: Author
    content: string
    timestamp: string
    likes: number
  }
  
  export interface Post {
    id: string
    author: Author
    content: string
    image?: string
    timestamp: string
    likes: number
    comments: Comment[]
  }
  
  export interface TrendingTopic {
    category: string
    title: string
    posts: number
  }
  
  export interface MarketplaceItem {
    id: string
    title: string
    price: number
    image: string
    location: string
    listedTime: string
    category: string
  }
  
  export interface UserProfile {
    name: string
    username: string
    avatar: string
    coverImage: string
    bio: string
    location: string
    website?: string
    joinDate: string
    following: number
    followers: number
  }
  