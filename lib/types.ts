import { Database } from './supabase.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Post = Database['public']['Tables']['posts']['Row'] & {
  profiles: Profile;
  likes: Like[];
  comments: Comment[];
};
export type Comment = Database['public']['Tables']['comments']['Row'] & {
  profiles: Profile;
};
export type Like = Database['public']['Tables']['likes']['Row'];
export type Conversation = Database['public']['Tables']['conversations']['Row'] & {
  profiles: Profile;
  messages: Message[];
};
export type Message = Database['public']['Tables']['messages']['Row'] & {
  profiles: Profile;
};
export type MarketplaceItem = Database['public']['Tables']['marketplace_items']['Row'] & {
  profiles: Profile;
};
export type Notification = Database['public']['Tables']['notifications']['Row'] & {
  profiles: Profile;
};
