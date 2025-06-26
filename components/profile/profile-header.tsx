"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, MapPin, Pencil, Loader2 } from "lucide-react";
import { getProfile } from "@/lib/data";
import { useSession } from "next-auth/react";
import { Profile } from "@/lib/types";
import { toast } from "sonner";

type ProfileHeaderProps = {
  userId?: string;
};

export default function ProfileHeader({ userId }: ProfileHeaderProps) {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const targetUserId = userId || session?.user?.id;
  const isOwnProfile = !userId || userId === session?.user?.id;

  useEffect(() => {
    if (session?.user) {
      loadProfile();
    }
  }, [targetUserId, session]);

  async function loadProfile() {
    if (!targetUserId) {
      setLoading(false);
      return;
    }
    
    try {
      const fetchedProfile = await getProfile(targetUserId);
      setProfile(fetchedProfile);
    } catch (error) {
      console.error('Failed to load profile:', error);
      // If API fails, create a basic profile from session data
      if (isOwnProfile && session?.user) {
        setProfile({
          id: session.user.id,
          username: session.user.name || session.user.email?.split('@')[0] || 'User',
          full_name: session.user.name || '',
          avatar_url: session.user.image || null,
          bio: null,
          website: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } else {
        toast.error("Failed to load profile.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>Profile not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src="/placeholder.svg"
          alt="Cover image"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      <CardContent className="relative pt-0">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage
                src={profile.avatar_url || "/placeholder.svg"}
                alt={profile.full_name || profile.username}
                className="w-full h-full object-cover object-contain"
              />
              <AvatarFallback>
                {profile.full_name?.[0] || profile.username[0]}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4 sm:mt-0 sm:mb-2">
              <h1 className="text-2xl font-bold">
                {profile.full_name || profile.username}
              </h1>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>
          </div>
          {isOwnProfile && (
            <div className="mt-4 sm:mt-0">
              <Link href="/profile/edit">
                <Button variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {profile.bio && <p>{profile.bio}</p>}

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {profile.website && (
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                {profile.website}
              </div>
            )}
            <div className="flex items-center">
              <CalendarDays className="mr-1 h-4 w-4" />
              Joined {new Date(profile.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="flex gap-6">
            <div>
              <span className="font-bold">0</span>{" "}
              <span className="text-muted-foreground">Following</span>
            </div>
            <div>
              <span className="font-bold">0</span>{" "}
              <span className="text-muted-foreground">Followers</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
