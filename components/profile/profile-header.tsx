import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, MapPin, Pencil } from "lucide-react";
import { getUserProfile } from "@/lib/data";

export default function ProfileHeader() {
  const profile = getUserProfile();

  return (
    <Card>
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={profile.coverImage || "/placeholder.svg"}
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
                src={profile.avatar || "/placeholder.svg"}
                alt={profile.name}
                className="w-full h-full object-cover object-contain"
              />
              <AvatarFallback>{profile.name[0]}</AvatarFallback>
            </Avatar>
            <div className="mt-4 sm:mt-0 sm:mb-2">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/profile/edit">
              <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <p>{profile.bio}</p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {profile.location && (
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                {profile.location}
              </div>
            )}
            <div className="flex items-center">
              <CalendarDays className="mr-1 h-4 w-4" />
              Joined {profile.joinDate}
            </div>
          </div>

          <div className="flex gap-6">
            <div>
              <span className="font-bold">{profile.following}</span>{" "}
              <span className="text-muted-foreground">Following</span>
            </div>
            <div>
              <span className="font-bold">{profile.followers}</span>{" "}
              <span className="text-muted-foreground">Followers</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
