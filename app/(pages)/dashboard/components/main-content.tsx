"use client"

import { useState, useEffect } from "react"
import { Search, Star, GitFork, Calendar, ExternalLink, Play, FileIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MainContentProps {
  activeTab: string
}

export function MainContent({ activeTab }: MainContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("updated")
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 500)
    return () => clearTimeout(timer)
  }, [activeTab])

  const pinnedWorkspaces = [
    {
      name: "intro-animation.mp4",
      description: "Animated logo introduction for brand videos",
      language: "TypeScript",
      stars: 124,
      forks: 23,
      updated: "2 days ago",
      status: "active",
      videoThumbnail: "/images/intro-animation.png",
      hasVideo: true,
      fileSize: "12.4 MB",
      owner: "utuvoih",
      duration: "0:15",
    },
    {
      name: "product-showcase.mp4",
      description: "Interactive product demonstration and features",
      language: "Python",
      stars: 89,
      forks: 15,
      updated: "1 day ago",
      status: "active",
      videoThumbnail: "/product-showcase.png",
      hasVideo: true,
      fileSize: "8.7 MB",
      owner: "designpro",
      duration: "0:45",
    },
    {
      name: "user-onboarding.mp4",
      description: "Complete user onboarding flow walkthrough",
      language: "JavaScript",
      stars: 67,
      forks: 12,
      updated: "3 days ago",
      status: "archived",
      videoThumbnail: "/user-onboarding.jpg",
      hasVideo: true,
      fileSize: "15.2 MB",
      owner: "uxmaster",
      duration: "1:20",
    },
  ]

  const allRepositories = [
    ...pinnedWorkspaces,
    {
      name: "Portfolio Website",
      description: "Personal portfolio built with Next.js",
      language: "TypeScript",
      stars: 45,
      forks: 8,
      updated: "1 week ago",
      status: "active",
      videoThumbnail: "/portfolio-website-showcase.jpg",
      hasVideo: true,
      fileSize: "5.6 MB",
      owner: "john_doe",
      duration: "0:30",
    },
    {
      name: "Data Visualization Tool",
      description: "Interactive charts and graphs library",
      language: "JavaScript",
      stars: 156,
      forks: 34,
      updated: "2 weeks ago",
      status: "active",
      videoThumbnail: "/data-visualization-charts.png",
      hasVideo: true,
      fileSize: "7.8 MB",
      owner: "jane_smith",
      duration: "1:00",
    },
    {
      name: "Authentication Service",
      description: "Microservice for user authentication",
      language: "Go",
      stars: 78,
      forks: 19,
      updated: "1 month ago",
      status: "active",
      videoThumbnail: "/authentication-service-demo.jpg",
      hasVideo: true,
      fileSize: "9.1 MB",
      owner: "alice_jones",
      duration: "0:45",
    },
  ]

  const starredRepositories = [
    {
      name: "intro-animation.mp4",
      description: "Animated logo introduction for brand videos",
      language: "TypeScript",
      stars: 124,
      forks: 23,
      updated: "2 days ago",
      status: "active",
      videoThumbnail: "/images/intro-animation.png",
      hasVideo: true,
      fileSize: "12.4 MB",
      owner: "utuvoih",
      duration: "0:15",
    },
    {
      name: "product-showcase.mp4",
      description: "Interactive product demonstration and features",
      language: "Python",
      stars: 89,
      forks: 15,
      updated: "1 day ago",
      status: "active",
      videoThumbnail: "/product-showcase.png",
      hasVideo: true,
      fileSize: "8.7 MB",
      owner: "designpro",
      duration: "0:45",
    },
  ]

  const filteredStarredRepositories = starredRepositories.filter((starredRepo) =>
    allRepositories.some((repo) => repo.name === starredRepo.name),
  )

  const renderOverview = () => (
    <div
      className={`space-y-6 transition-all duration-500 ${isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}
    >
      {/* Pinned Repositories */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          <Star className="w-5 h-5 mr-2 text-primary" />
          Pinned Workspaces
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pinnedWorkspaces.slice(0, 4).map((workspace, index) => (
            <Card
              key={workspace.name}
              className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer group bg-card border-border"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Video Thumbnail */}
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-secondary/50 group-hover:ring-2 ring-primary/50 transition-all duration-300">
                      <img
                        src={workspace.videoThumbnail || "/placeholder.svg"}
                        alt={`${workspace.name} demo`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                      {workspace.duration}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <FileIcon className="w-4 h-4 text-primary flex-shrink-0" />
                        <h3 className="text-sm font-medium text-primary group-hover:text-primary/80 transition-colors truncate">
                          {workspace.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{workspace.description}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3" />
                        <span>{workspace.updated}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-primary">{workspace.fileSize}</span>
                        <span className="text-primary font-medium">{workspace.owner}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          <Calendar className="w-5 h-5 mr-2 text-primary" />
          Recent Activity
        </h3>
        <Card className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 bg-card border-border">
          <CardContent className="p-4">
            <div className="space-y-4">
              {[
                { action: "Created", repo: "E-commerce Platform", time: "2 hours ago" },
                { action: "Starred", repo: "React Query", time: "1 day ago" },
                { action: "Forked", repo: "Tailwind CSS", time: "3 days ago" },
                { action: "Updated", repo: "AI Chat Bot", time: "1 week ago" },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-sm text-foreground">
                      <span className="font-medium">{activity.action}</span> {activity.repo}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderRepositories = () => (
    <div
      className={`space-y-6 transition-all duration-500 ${isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}
    >
      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border focus:border-primary"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48 bg-card border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="updated">Recently updated</SelectItem>
            <SelectItem value="created">Recently created</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="stars">Most stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Repository List */}
      <div className="space-y-4">
        {allRepositories.map((repo, index) => (
          <Card
            key={repo.name}
            className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.01] cursor-pointer group bg-card border-border"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                {/* Video Thumbnail */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-secondary/50 group-hover:ring-2 ring-primary/50 transition-all duration-300">
                    <img
                      src={repo.videoThumbnail || "/placeholder.svg"}
                      alt={`${repo.name} demo`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                    {repo.duration}
                  </div>
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FileIcon className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold text-primary group-hover:text-primary/80 transition-colors">
                        {repo.name}
                      </h3>
                      <Badge
                        variant={repo.status === "active" ? "default" : "secondary"}
                        className="text-xs bg-primary/20 text-primary border-primary/30"
                      >
                        {repo.status}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{repo.description}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{repo.updated}</span>
                      </div>
                      <span className="flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center">
                        <GitFork className="w-3 h-3 mr-1" />
                        {repo.forks}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-primary">{repo.fileSize}</span>
                      <span className="text-primary font-medium">{repo.owner}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderStars = () => (
    <div
      className={`space-y-6 transition-all duration-500 ${isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Starred Video Workspaces</h3>
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
          {filteredStarredRepositories.length} starred
        </Badge>
      </div>

      <div className="space-y-4">
        {filteredStarredRepositories.map((repo, index) => (
          <Card
            key={repo.name}
            className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.01] cursor-pointer group bg-card border-border"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                {/* Video Thumbnail */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-secondary/50 group-hover:ring-2 ring-primary/50 transition-all duration-300">
                    <img
                      src={repo.videoThumbnail || "/placeholder.svg"}
                      alt={`${repo.name} demo`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                    {repo.duration}
                  </div>
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FileIcon className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold text-primary group-hover:text-primary/80 transition-colors">
                        {repo.name}
                      </h3>
                      <Badge
                        variant={repo.status === "active" ? "default" : "secondary"}
                        className="text-xs bg-primary/20 text-primary border-primary/30"
                      >
                        {repo.status}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
                    >
                      <Star className="w-4 h-4 fill-current text-primary" />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{repo.description}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{repo.updated}</span>
                      </div>
                      <span className="flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center">
                        <GitFork className="w-3 h-3 mr-1" />
                        {repo.forks}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-primary">{repo.fileSize}</span>
                      <span className="text-primary font-medium">{repo.owner}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview()
      case "repositories":
        return renderRepositories()
      case "stars":
        return renderStars()
      default:
        return renderOverview()
    }
  }

  return <div className="flex-1 p-6 premium-scrollbar relative z-10">{renderContent()}</div>
}
