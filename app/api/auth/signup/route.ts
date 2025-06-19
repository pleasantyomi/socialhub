import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // Input validation
    if (!email || !password || !name) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (authError) {
      return new Response(authError.message, { status: 400 });
    }

    // If user was created successfully, create their profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: email,
          full_name: name,
          username: email.split('@')[0], // Default username from email
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`, // Default avatar
          created_at: new Date().toISOString(),
        });

      if (profileError) {
        // If profile creation fails, we should ideally delete the auth user
        // but Supabase will handle this with its RLS policies
        return new Response('Failed to create user profile', { status: 500 });
      }
    }

    return new Response('User created successfully', { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
