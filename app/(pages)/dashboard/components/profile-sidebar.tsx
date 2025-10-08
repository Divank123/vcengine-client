"use client"

import { Award, MapPin, LinkIcon, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditProfileDialog } from "./edit-profile-dialog"

interface ProfileSidebarProps {
  profileData: {
    username: string
    email: string
    description: string
    website: string
    location: string
    profileImage: string
  }
  onProfileSave: (data: ProfileSidebarProps["profileData"]) => void
}

export function ProfileSidebar({ profileData, onProfileSave }: ProfileSidebarProps) {
  const achievements = [
    { name: "Early Adopter", icon: "🚀", description: "Joined in the first month" },
    { name: "Code Master", icon: "💻", description: "100+ repositories created" },
    { name: "Team Player", icon: "🤝", description: "50+ collaborations" },
    { name: "Star Collector", icon: "⭐", description: "1000+ stars earned" },
  ]

  return (
    <div className="w-full space-y-6 animate-float-up">
      {/* Profile Card */}
      <Card className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover-lift bg-card border-border">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
              <AvatarImage src={profileData.profileImage || "/developer-avatar.png"} alt="Profile" />
              <AvatarFallback className="text-2xl bg-secondary text-secondary-foreground">
                {profileData.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">{profileData.username}</h2>
              <p className="text-muted-foreground">{profileData.email}</p>
            </div>

            <EditProfileDialog initialData={profileData} onSave={onProfileSave}>
              <Button
                variant="outline"
                disabled
                className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 bg-card border-primary/50 text-primary hover:border-primary hover-lift"
              >
                <span className="mr-2">✏️</span>
                Edit Profile
              </Button>
            </EditProfileDialog>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover-lift bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">{profileData.description}</p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <MapPin className="w-4 h-4" />
              <span>{profileData.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
              <LinkIcon className="w-4 h-4" />
              <span className="text-primary hover:underline cursor-pointer">{profileData.website}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <Calendar className="w-4 h-4" />
              <span>Joined March 2023</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover-lift bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center text-foreground">
            <Award className="w-5 h-5 mr-2 text-primary" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.name}
                className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-300 hover:scale-105 cursor-pointer group border border-border/50 hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center space-y-1">
                  <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                    {achievement.icon}
                  </div>
                  <div className="text-xs font-medium text-foreground">{achievement.name}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
