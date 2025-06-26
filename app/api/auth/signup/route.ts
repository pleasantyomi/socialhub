import { NextResponse } from 'next/server';
import { createApiResponse } from '@/lib/api-utils';
import { supabase } from '@/lib/supabase';
import { userStore, type User } from '@/lib/user-store';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // Input validation
    if (!email || !password || !name) {
      return createApiResponse({
        error: 'Missing required fields',
        status: 400,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createApiResponse({
        error: 'Invalid email format',
        status: 400,
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return createApiResponse({
        error: 'Password must be at least 6 characters long',
        status: 400,
      });
    }

    try {
      // Try to create user in Supabase first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (authData?.user && !authError) {
        // Create user profile in Supabase
        const username = email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 4);
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username,
            full_name: name,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't fail the signup if profile creation fails
        }

        return createApiResponse({
          data: { 
            message: 'User created successfully. Please check your email to verify your account.',
            userId: authData.user.id,
            requiresVerification: !authData.user.email_confirmed_at
          },
          status: 201,
        });
      }

      // If Supabase signup fails, fall back to in-memory store for demo
      if (authError && authError.message.includes('User already registered')) {
        return createApiResponse({
          error: 'User already exists',
          status: 409,
        });
      }

      console.warn('Supabase signup failed, falling back to in-memory store:', authError?.message);
    } catch (supabaseError) {
      console.warn('Supabase error, falling back to in-memory store:', supabaseError);
    }

    // Fallback to in-memory store for demo purposes
    // Check if user already exists in memory store
    if (userStore.exists(email)) {
      return createApiResponse({
        error: 'User already exists',
        status: 409,
      });
    }

    // Hash password for in-memory store
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user in memory store
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      password: hashedPassword,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      created_at: new Date().toISOString(),
    };

    userStore.addUser(newUser);
    console.log('User created in memory store:', newUser.email, 'Total users:', userStore.count());

    return createApiResponse({
      data: { 
        message: 'User created successfully (demo mode)',
        userId: newUser.id,
        requiresVerification: false
      },
      status: 201,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return createApiResponse({
      error: 'Internal server error',
      status: 500,
    });
  }
}
