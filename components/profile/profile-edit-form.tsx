"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfile, updateProfile } from "@/lib/data";
import { useSession } from "next-auth/react";
import { Profile } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ProfileEditForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    bio: "",
    website: "",
  });
  useEffect(() => {
    loadProfile();
  }, [session?.user?.id]);

  async function loadProfile() {
    if (!session?.user?.id) return;
    
    try {
      const fetchedProfile = await getProfile(session.user.id);
      setProfile(fetchedProfile);
      setFormData({
        full_name: fetchedProfile.full_name || "",
        username: fetchedProfile.username || "",
        bio: fetchedProfile.bio || "",
        website: fetchedProfile.website || "",
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    try {
      await updateProfile(session.user.id, formData);
      toast.success("Profile updated successfully!");
      router.push("/profile");
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
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
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-6 p-6">          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={profile.avatar_url || "/placeholder.svg"}
                alt={profile.full_name || profile.username}
                className="w-full h-full object-cover object-center"
              />
              <AvatarFallback>
                {profile.full_name?.[0] || profile.username[0]}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Change Profile Picture
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Name</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 p-6">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/profile")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
