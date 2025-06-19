-- Function to get trending topics based on hashtag usage in posts
create or replace function get_trending_topics()
returns table (
  id text,
  name text,
  posts_count bigint,
  category text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with hashtags as (
    select
      regexp_matches(content, '#(\w+)', 'g') as tag,
      created_at
    from posts
    where created_at > now() - interval '7 days'
  ),
  counted_tags as (
    select
      tag[1] as name,
      count(*) as posts_count,
      case
        when tag[1] ~ '^(study|homework|research|exam|test)' then 'Academic'
        when tag[1] ~ '^(event|party|meetup|social)' then 'Social'
        when tag[1] ~ '^(campus|university|college)' then 'Campus'
        else 'General'
      end as category
    from hashtags
    group by tag[1]
  )
  select
    md5(name) as id,
    '#' || name as name,
    posts_count,
    category
  from counted_tags
  order by posts_count desc
  limit 10;
end;
$$;

-- Function to get suggested users based on common interests and connections
create or replace function get_suggested_users(current_user_id uuid)
returns table (
  id uuid,
  username text,
  full_name text,
  avatar_url text,
  website text,
  bio text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  follower_count bigint,
  is_following boolean
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with user_stats as (
    select
      p.id,
      p.username,
      p.full_name,
      p.avatar_url,
      p.website,
      p.bio,
      p.created_at,
      p.updated_at,
      count(f.follower_id) as follower_count,
      exists(
        select 1
        from follows f2
        where f2.user_id = p.id
        and f2.follower_id = current_user_id
      ) as is_following
    from profiles p
    left join follows f on f.user_id = p.id
    where p.id != current_user_id
    group by p.id
  )
  select *
  from user_stats
  where not is_following
  order by follower_count desc
  limit 10;
end;
$$;

-- Table for follows
create table if not exists follows (
  user_id uuid references profiles(id),
  follower_id uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, follower_id)
);

-- Enable RLS on follows
alter table follows enable row level security;

-- Policies for follows
create policy "Anyone can read follows"
  on follows for select
  using (true);

create policy "Users can insert their own follows"
  on follows for insert
  with check (follower_id = auth.uid());

create policy "Users can delete their own follows"
  on follows for delete
  using (follower_id = auth.uid());

-- Function to get user's feed posts (posts from followed users and own posts)
create or replace function get_feed_posts(user_id uuid)
returns setof posts
language sql
security definer
set search_path = public
as $$
  select distinct p.*
  from posts p
  left join follows f on f.user_id = p.profile_id
  where p.profile_id = user_id
    or f.follower_id = user_id
  order by p.created_at desc
  limit 50;
$$;

-- Function to get post statistics
create or replace function get_post_stats(post_ids uuid[])
returns table (
  post_id uuid,
  like_count bigint,
  comment_count bigint
)
language sql
security definer
set search_path = public
as $$
  select
    p.id as post_id,
    count(distinct l.id) as like_count,
    count(distinct c.id) as comment_count
  from posts p
  left join likes l on l.post_id = p.id
  left join comments c on c.post_id = p.id
  where p.id = any(post_ids)
  group by p.id;
$$;
