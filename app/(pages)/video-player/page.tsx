"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Crop, Download, Play, Pause, Volume2, Settings, Maximize, ChevronDown, X, Video } from "lucide-react"
import Image from "next/image"
import Hls from "hls.js"
import { useUser } from "@/context/user-context"
import { requestHandler } from "@/lib/requestHandler"

interface Workspace {
  Branch: {
    id: string,
    name: string
  }
  banner: string
  createdAt: string
  id: string
  name: string
  type: string
}

export default function VideoStudioPage({ userId }: { userId: string }) {
  const { user, setUser } = useUser()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(600)
  const [showControls, setShowControls] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState("Version 1")
  const [showSettings, setShowSettings] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState("1x")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [volume, setVolume] = useState(50)

  const [maxResolution, setMaxResolution] = useState<number>(360)
  const [activeResolution, setActiveResolution] = useState<number>(360)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showWorkspaceSelector, setShowWorkspaceSelector] = useState(false)

  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Fetch dynamic workspaces
  useEffect(() => {
    ; (async () => {
      try {
        if (!user) {
          requestHandler({
            url: "/auth/user",
            method: "GET",
            action: ({ user }: any) => {
              setUser(user)
            }
          })
        }

        requestHandler({
          url: `/workspace/${user?.id}`,
          method: "GET",
          action: ({ workspaces }: any) => {
            console.log(workspaces);
            setWorkspaces(workspaces)
            setActiveWorkspace(workspaces[0])
          }
        })
      } catch (err) {
        console.error("Failed to fetch workspaces:", err)
      }
    })()
  }, [user])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    if (videoRef.current) {
      if (videoRef.current.paused) videoRef.current.play()
      else videoRef.current.pause()
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseInt(e.target.value)
    setCurrentTime(newTime)
    if (videoRef.current) videoRef.current.currentTime = newTime
  }

  const handleSettingsClick = () => setShowSettings(!showSettings)
  const handleFullscreen = () => {
    if (!isFullscreen) containerRef.current?.requestFullscreen?.()
    else document.exitFullscreen?.()
  }
  const handleVolumeClick = () => setShowVolumeSlider(!showVolumeSlider)
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseInt(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) videoRef.current.volume = newVolume / 100
  }
  const handleWorkspaceChange = (workspaceId: string) => {
    // setActiveWorkspace(workspa)
    setShowWorkspaceSelector(false)
  }

  // Load video based on activeWorkspace & resolution
  useEffect(() => {
    ; (async () => {
      const video = videoRef.current
      if (!video || !activeWorkspace?.id) return

      try {
        requestHandler({
          url: `/video/max-resolution/${activeWorkspace.id}`,
          method: 'GET',
          action: ({ maxResolution }: any) => {
            setMaxResolution(maxResolution)
          }
        })
      } catch (err) {
        console.error("Failed to fetch max resolution:", err)
      }

      const version = 1
      const src = `http://localhost:1234/api/v1/video/playlist/${activeWorkspace.id}/${version}/${activeResolution}`
      const currentTime = video.currentTime
      setIsLoading(true)

      try {
        if (Hls.isSupported()) {
          hlsRef.current?.destroy()
          const hls = new Hls()
          hls.loadSource(src)
          hls.attachMedia(video)
          hlsRef.current = hls

          hls.on(Hls.Events.FRAG_LOADED, () => {
            video.currentTime = currentTime
            if (isPlaying) video.play().catch(() => { })
            setIsLoading(false)
          })

          hls.on(Hls.Events.ERROR, (_, data) => {
            console.log("[v0] HLS error:", data)
            setIsLoading(false)
          })
        }

        const handlePlay = () => setIsPlaying(true)
        const handlePause = () => setIsPlaying(false)
        const handleTimeUpdate = () => setCurrentTime(video.currentTime)
        const handleLoadedMetadata = () => setDuration(video.duration)

        video.addEventListener("play", handlePlay)
        video.addEventListener("pause", handlePause)
        video.addEventListener("timeupdate", handleTimeUpdate)
        video.addEventListener("loadedmetadata", handleLoadedMetadata)

        return () => {
          video.removeEventListener("play", handlePlay)
          video.removeEventListener("pause", handlePause)
          video.removeEventListener("timeupdate", handleTimeUpdate)
          video.removeEventListener("loadedmetadata", handleLoadedMetadata)
        }
      } catch (error) {
        console.log("[v0] Failed to fetch video:", error)
      }
    })()
  }, [activeResolution, activeWorkspace, workspaces, isPlaying])

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  useEffect(() => setShowSettings(false), [playbackSpeed, activeResolution])

  const resolutions = [144, 240, 360, 480, 720, 1080, 1440, 2160]
  const availableResolutions = resolutions.filter((res) => res <= maxResolution)
  console.log(availableResolutions);

  const currentWorkspace = workspaces.find((ws) => ws.id === activeWorkspace?.id)

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden relative premium-scrollbar" ref={containerRef}>

      {/* Main content */}
      <main className={isFullscreen ? "h-screen" : "h-[92vh]"} style={{ flex: 1, flexDirection: "column" }}>
        {!isFullscreen && (
          <div className="px-6 py-3 flex items-center justify-between border-b border-border/40 glass-effect bg-card/40">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">{user?.username}</span>
              <span className="text-muted-foreground/60">/</span>
              <span className="text-silver font-semibold">{activeWorkspace?.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWorkspaceSelector(true)}
                className="bg-transparent border-border hover:border-[var(--silver)] hover:bg-[color:oklch(0.7_0.02_240_/_.1)] text-foreground hover:cursor-pointer hover-lift"
              >
                <Video className="w-4 h-4 mr-2" crossOrigin="anonymous" />
                Change Video
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-border hover:border-[var(--silver)] hover:bg-[color:oklch(0.7_0.02_240_/_.1)] text-foreground hover:cursor-pointer hover-lift"
              >
                <Crop className="w-4 h-4 mr-2" />
                Crop
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-border hover:border-[var(--silver)] hover:bg-[color:oklch(0.7_0.02_240_/_.1)] text-foreground hover:cursor-pointer hover-lift"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center px-6 py-5 relative">
          <AnimatePresence>
            {showWorkspaceSelector && (
              <motion.div
                className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-end justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setShowWorkspaceSelector(false)}
              >
                <motion.div
                  className={`w-full h-[65%] bg-transparent backdrop-blur-md border border-border/30 rounded-t-2xl p-6 ${isFullscreen ? "mb-0" : "mb-[10%]"
                    }`}
                  initial={{ y: "100%" }}
                  animate={{ y: "70%" }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-foreground">Select Video</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowWorkspaceSelector(false)}
                      className="text-muted-foreground hover:text-foreground hover:bg-background/50"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex h-full gap-6">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground mb-3">Projects</h4>
                      <div className="space-y-1">
                        {
                          workspaces.length > 1 ?
                            workspaces.map(
                              (workspace, index) =>
                                workspace.id !== activeWorkspace?.id && (
                                  <motion.div
                                    key={workspace.id}
                                    className={`cursor-pointer group flex-shrink-0 w-72 ${activeWorkspace?.id === workspace.id ? "ring-2 ring-[var(--silver)]" : ""
                                      }`}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => handleWorkspaceChange(workspace.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <div className="bg-background/40 backdrop-blur-md rounded-lg overflow-hidden border border-border/40 group-hover:border-[var(--silver)]/50 transition-all duration-300 shadow-lg">
                                      <div className="flex flex-col">
                                        <div className="relative w-full h-32">
                                          <Image
                                            src={`/placeholder.svg?height=128&width=256&query=project%20thumbnail`}
                                            alt={workspace.name}
                                            fill
                                            className="object-cover thumb-fade-in"
                                          />
                                        </div>
                                        <div className="p-4 bg-background/20 backdrop-blur-sm">
                                          <h4 className="text-foreground font-medium text-base mb-2">{workspace.name}</h4>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ),
                            )
                            :
                            <p>No Other Workspaces</p>
                        }
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className={`relative ${isFullscreen ? "w-full h-full" : "w-[85vw] h-[78vh]"
              } bg-card/60 glass-effect rounded-2xl overflow-hidden shadow-2xl border border-border/40 hover-lift`}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            whileHover={{ scale: isFullscreen ? 1 : 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  className="absolute inset-0 bg-background/90 backdrop-blur-xl rounded-2xl flex items-center justify-center z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-background/10 rounded-full"></div>
                      <motion.div
                        className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[var(--silver)] border-r-[var(--silver)]/70 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                    </div>
                    <div className="text-foreground/90 text-sm font-medium">Loading video...</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <video
              ref={videoRef}
              className="w-full h-full bg-gradient-to-br from-muted to-background"
              style={{ aspectRatio: "16/9" }}
            />
            <div className="w-full h-full bg-gradient-to-br from-background/40 to-background/60 flex items-center justify-center">
              <div className="text-center animate-float-up">
                <Video className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">Video Player</p>
                <p className="text-muted-foreground/80 text-sm mt-2">
                  {currentWorkspace?.name || "Select a video to play"}
                </p>
              </div>
            </div>

            {!isPlaying && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  className="w-24 h-24 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center border border-[var(--silver)]/30 hover:border-[var(--silver)]/70 transition-all duration-300 silver-glow"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayPause}
                >
                  <Play className="w-12 h-12 text-silver ml-1" />
                </motion.button>
              </div>
            )}

            <AnimatePresence>
              {showControls && (
                <>
                  <motion.div
                    className="absolute top-4 left-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="glass-effect px-4 py-2 rounded-full">
                      <h3 className="font-semibold">{currentWorkspace?.name || "Creative Project Demo"}</h3>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute top-4 right-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="bg-background/70 backdrop-blur-sm border-border text-foreground hover:border-[var(--silver)]"
                        >
                          {selectedVersion}
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card/95 backdrop-blur-sm border-border">
                        <DropdownMenuItem
                          onClick={() => setSelectedVersion("Version 1")}
                          className="hover:bg-[color:oklch(0.7_0.02_240_/_.1)] hover:text-silver"
                        >
                          Version 1
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>

                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-background/70 backdrop-blur-sm p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" onClick={handlePlayPause} className="hover:bg-muted/20 p-2">
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>

                      <span className="text-sm font-mono whitespace-nowrap">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>

                      <div className="flex-1 mx-6">
                        <input
                          type="range"
                          min="0"
                          max={duration}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, var(--silver) 0%, var(--silver) ${(currentTime / duration) * 100
                              }%, var(--muted-foreground) ${(currentTime / duration) * 100
                              }%, var(--muted-foreground) 100%)`,
                          }}
                        />
                      </div>

                      <div className="flex items-center gap-2 relative">
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-muted/20 p-2"
                            onClick={handleVolumeClick}
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>

                          <AnimatePresence>
                            {showVolumeSlider && (
                              <motion.div
                                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border">
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-1 h-20 bg-muted rounded-lg appearance-none cursor-pointer"
                                    style={{
                                      WebkitAppearance: "slider-vertical",
                                      background: `linear-gradient(to top, var(--silver) 0%, var(--silver) ${volume}%, var(--muted-foreground) ${volume}%, var(--muted-foreground) 100%)`,
                                    }}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-muted/20 p-2"
                          onClick={handleSettingsClick}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-muted/20 p-2" onClick={handleFullscreen}>
                          <Maximize className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                className="absolute inset-0 z-50 flex items-end justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setShowSettings(false)}
              >
                <motion.div
                  className={`w-[42.5vw] h-[65%] bg-transparent backdrop-blur-md border border-border/30 rounded-t-2xl p-6 ${isFullscreen ? "mb-0" : "mb-[10%]"
                    }`}
                  initial={{ y: "100%" }}
                  animate={{ y: "70%" }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-foreground">Settings</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(false)}
                      className="text-muted-foreground hover:text-foreground hover:bg-background/50"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex h-full gap-6">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground mb-3">Playback Speed</h4>
                      <div className="space-y-1">
                        {["0.5x", "0.75x", "1x", "1.25x", "1.5x", "1.75x", "2x"].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => setPlaybackSpeed(speed)}
                            className={`w-full text-left px-3 py-1.5 rounded-md transition-all duration-200 text-sm ${playbackSpeed === speed
                              ? "bg-background/70 backdrop-blur-sm text-foreground border border-border"
                              : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                              }`}
                          >
                            {speed}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="w-px h-64 bg-border/50"></div>

                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground mb-3">Quality</h4>
                      <div className="space-y-1">
                        {availableResolutions.reverse().map((res) => (
                          <button
                            key={res}
                            onClick={() => setActiveResolution(res)}
                            className={`w-full text-left px-3 py-1.5 rounded-md transition-all duration-200 text-sm ${activeResolution === res
                              ? "bg-background/70 backdrop-blur-sm text-foreground border border-border"
                              : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                              }`}
                          >
                            {res}p
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}


