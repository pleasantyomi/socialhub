import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        try {
          // Try to authenticate with Supabase first
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (authData?.user && !authError) {
            // Get user profile from Supabase
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', authData.user.id)
              .single();

            return {
              id: authData.user.id,
              email: authData.user.email!,
              name: profile?.full_name || authData.user.user_metadata?.name || credentials.email,
              image: profile?.avatar_url || authData.user.user_metadata?.avatar_url,
            };
          }

          // Fallback to in-memory store for demo/development
          const { userStore } = await import('@/lib/user-store');
          const user = userStore.findByEmail(credentials.email);
          
          if (!user) {
            throw new Error('No user found');
          }

          // Check password (in production, compare hashed passwords)
          const isValid = user.password === credentials.password || 
                          await bcrypt.compare(credentials.password, user.password).catch(() => false);

          if (!isValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error('Invalid credentials');
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle OAuth sign-ins (Google, GitHub)
      if (account?.provider !== 'credentials' && user.email) {
        try {
          // Check if user exists in Supabase
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

          if (!existingProfile) {
            // Create profile for OAuth users
            const username = user.email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 4);
            
            const { error } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                username,
                full_name: user.name || user.email,
                avatar_url: user.image,
              });

            if (error) {
              console.error('Error creating OAuth user profile:', error);
              // Don't block login if profile creation fails
            }
          }
        } catch (error) {
          console.error('OAuth sign-in error:', error);
          // Don't block login if database operations fail
        }
      }
      
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        if (account) {
          token.provider = account.provider;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
