"use client";

import type React from "react";
import thumbnailSvg from "./793430-final.jpg";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Crop,
  Download,
  Play,
  Pause,
  Volume2,
  Settings,
  Maximize,
  ChevronDown,
  X,
  Video,
} from "lucide-react";
import Hls from "hls.js";
import Image from "next/image";

export default function VideoStudioPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(600); // 10 minutes
  const [showControls, setShowControls] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("Version 1");
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState("1x");
  const [resolution, setResolution] = useState("1080p");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volume, setVolume] = useState(50);

  const [maxResolution, setMaxResolution] = useState<number>(1080);
  const [activeResolution, setActiveResolution] = useState<number>(1080);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showWorkspaceSelector, setShowWorkspaceSelector] = useState(false);

  const WORKSPACES = [
    {
      id: "harshiile",
      title: "Harshiile Project",
      thumbnail: "/video-thumbnail-1.png",
    },
    {
      id: "original",
      title: "Original Content",
      thumbnail: "/video-thumbnail-2.png",
    },
    {
      id: "abc",
      title: "ABC Production",
      thumbnail: "/video-thumbnail-abstract-design.png",
    },
  ];
  const [activeWorkspace, setActiveWorkspace] = useState<string>(
    WORKSPACES[1].id
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseInt(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleVolumeClick = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseInt(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
  };

  const handleWorkspaceChange = (workspaceId: string) => {
    setActiveWorkspace(workspaceId);
    setShowWorkspaceSelector(false);
  };

  const handleResolutionChange = (newResolution: string) => {
    setResolution(newResolution);
    const newResNumber = Number.parseInt(newResolution.replace("p", ""));
    setActiveResolution(newResNumber);
  };

  useEffect(() => {
    fetch(`http://localhost:3000/max-resolution/${activeWorkspace}`)
      .then((res) => res.json())
      .then(({ maxResolution }) => {
        setMaxResolution(maxResolution);
        setActiveResolution(maxResolution);
        setResolution(`${maxResolution}p`);
      })
      .catch((error) => {
        console.log(
          "[v0] Failed to fetch max resolution, using defaults:",
          error
        );
      });
  }, [activeWorkspace]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const src = `http://localhost:3000/playlist/${activeWorkspace}/${activeResolution}`;
    const currentTime = video.currentTime;
    setIsLoading(true);

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.currentTime = currentTime;
        if (isPlaying) {
          video.play().catch(() => {});
        }
        setIsLoading(false);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.log("[v0] HLS error:", data);
        setIsLoading(false);
      });
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [activeResolution, activeWorkspace]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    setShowSettings(false);
  }, [playbackSpeed, resolution]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => Math.min(prev + 1, duration));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const resolutions = [144, 240, 360, 480, 720, 1080, 1440, 2160];
  const availableResolutions = resolutions.filter(
    (res) => res <= maxResolution
  );

  const currentWorkspace = WORKSPACES.find((ws) => ws.id === activeWorkspace);

  return (
    <div
      className="h-screen bg-black text-white flex flex-col overflow-hidden"
      ref={containerRef}
    >
      {!isFullscreen && (
        <nav className="h-[8vh] bg-black sticky top-0 z-50 shadow-2xl border-b border-gray-800/50">
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded-lg"></div>
              <span className="text-lg font-bold text-orange-500">
                CinemaStudio
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  className="w-60 pl-10 bg-gray-900 border-gray-700 focus:border-orange-500 transition-all duration-300 rounded-full text-sm"
                />
              </div>
              <Avatar className="w-8 h-8 ring-2 ring-orange-500/30 hover:ring-orange-500/60 transition-all duration-300 cursor-pointer">
                <AvatarImage src="/placeholder-user.png" />
                <AvatarFallback className="bg-orange-500 text-white font-semibold text-sm">
                  JD
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </nav>
      )}

      <main
        className={isFullscreen ? "h-screen" : "h-[92vh]"}
        style={{ flex: 1, flexDirection: "column" }}
      >
        {!isFullscreen && (
          <div className="px-6 py-3 flex items-center justify-between border-b border-gray-800/30">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-medium">john.doe</span>
              <span className="text-gray-600">/</span>
              <span className="text-orange-500 font-semibold">
                {activeWorkspace}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWorkspaceSelector(true)}
                className="bg-transparent border-gray-700 hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-300 text-white"
              >
                <Video className="w-4 h-4 mr-2" />
                Change Video
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-700 hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-300 text-white"
              >
                <Crop className="w-4 h-4 mr-2" />
                Crop
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-700 hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-300 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center px-6 py-5 bg-black relative">
          <AnimatePresence>
            {showWorkspaceSelector && (
              <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setShowWorkspaceSelector(false)}
              >
                <motion.div
                  className="w-full"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                    duration: 0.6,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl border-t border-gray-700/50 shadow-2xl flex flex-col">
                    <div className="p-4 border-b border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">
                          Select Video
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowWorkspaceSelector(false)}
                          className="text-gray-400 hover:text-white hover:bg-gray-800/50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex gap-6">
                        {WORKSPACES.map((workspace, index) => (
                          <>
                            {" "}
                            {workspace.id != activeWorkspace && (
                              <motion.div
                                key={workspace.id}
                                className={`cursor-pointer group flex-shrink-0 w-72 ${
                                  activeWorkspace === workspace.id
                                    ? "ring-2 ring-orange-500"
                                    : ""
                                }`}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() =>
                                  handleWorkspaceChange(workspace.id)
                                }
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="bg-gray-800/60 rounded-lg overflow-hidden border border-gray-700/50 group-hover:border-orange-500/50 transition-all duration-300">
                                  <div className="flex flex-col">
                                    <div className="relative w-full h-32">
                                      <Image
                                        src={thumbnailSvg}
                                        alt={workspace.title}
                                        key={workspace.title}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="p-4">
                                      <h4 className="text-white font-medium text-base mb-2">
                                        {workspace.title}
                                      </h4>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className={`relative ${
              isFullscreen ? "w-full h-full" : "w-[85vw] h-[78vh]"
            } bg-black rounded-2xl overflow-hidden shadow-2xl `}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            whileHover={{ scale: isFullscreen ? 1 : 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  className="absolute inset-0 bg-black/90 backdrop-blur-xl rounded-2xl flex items-center justify-center z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-white/10 rounded-full"></div>
                      <motion.div
                        className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-orange-500 border-r-orange-400 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                    </div>
                    <div className="text-white/90 text-sm font-medium">
                      Loading video...
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <video
              ref={videoRef}
              className="w-full h-full bg-gradient-to-br from-gray-900 to-black"
              style={{ aspectRatio: "16/9" }}
            />

            {!isPlaying && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  className="w-24 h-24 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayPause}
                >
                  <Play className="w-12 h-12 text-white ml-1" />
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
                    <div className="backdrop-blur-sm px-4 py-2 rounded-full">
                      <h3 className="text-white font-semibold">
                        {currentWorkspace?.title || "Creative Project Demo"}
                      </h3>
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
                          className="bg-black/70 backdrop-blur-sm border-gray-600 hover:border-orange-500 text-white"
                        >
                          {selectedVersion}
                          <ChevronDown className="w-4 h-4 ml-2 text-white" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-900/95 backdrop-blur-sm border-gray-700">
                        <DropdownMenuItem
                          onClick={() => setSelectedVersion("Version 1")}
                          className="text-white hover:bg-orange-500/20 hover:text-orange-500"
                        >
                          Version 1
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSelectedVersion("Version 2")}
                          className="text-white hover:bg-orange-500/20 hover:text-orange-500"
                        >
                          Version 2
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>

                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePlayPause}
                        className="text-white hover:bg-white/20 p-2"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </Button>

                      <span className="text-sm text-white font-mono whitespace-nowrap">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>

                      <div className="flex-1 mx-6">
                        <input
                          type="range"
                          min="0"
                          max={duration}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #f97316 0%, #f97316 ${
                              (currentTime / duration) * 100
                            }%, #4b5563 ${
                              (currentTime / duration) * 100
                            }%, #4b5563 100%)`,
                          }}
                        />
                      </div>

                      <div className="flex items-center gap-2 relative">
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 p-2"
                            onClick={handleVolumeClick}
                          >
                            <Volume2 className="w-4 h-4 text-white" />
                          </Button>

                          <AnimatePresence>
                            {showVolumeSlider && (
                              <motion.div
                                className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="bg-black/80 backdrop-blur-sm p-3 rounded-lg">
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-1 h-20 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                      WebkitAppearance: "slider-vertical",
                                      background: `linear-gradient(to top, #f97316 0%, #f97316 ${volume}%, #4b5563 ${volume}%, #4b5563 100%)`,
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
                          className="text-white hover:bg-white/20 p-2"
                          onClick={handleSettingsClick}
                        >
                          <Settings className="w-4 h-4 text-white" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 p-2"
                          onClick={handleFullscreen}
                        >
                          <Maximize className="w-4 h-4 text-white" />
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
                  className={`w-[42.5vw] h-[65%] bg-transparent backdrop-blur-md border border-gray-700/30 rounded-t-2xl p-6 ${
                    isFullscreen ? "mb-0" : "mb-[10%]"
                  }`}
                  initial={{ y: "100%" }}
                  animate={{ y: "70%" }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">
                      Settings
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(false)}
                      className="text-gray-400 hover:text-white hover:bg-gray-800/50"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex h-full gap-6">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white mb-3">
                        Playback Speed
                      </h4>
                      <div className="space-y-1">
                        {[
                          "0.5x",
                          "0.75x",
                          "1x",
                          "1.25x",
                          "1.5x",
                          "1.75x",
                          "2x",
                        ].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => setPlaybackSpeed(speed)}
                            className={`w-full text-left px-3 py-1.5 rounded-md transition-all duration-200 text-sm ${
                              playbackSpeed === speed
                                ? "bg-gray-800/70 backdrop-blur-sm text-white border border-gray-600"
                                : "text-gray-300 hover:bg-gray-800/30 hover:text-white"
                            }`}
                          >
                            {speed}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="w-px h-64 bg-gray-700/50"></div>

                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white mb-3">
                        Quality
                      </h4>
                      <div className="space-y-1">
                        {availableResolutions.reverse().map((res) => (
                          <button
                            key={res}
                            onClick={() => handleResolutionChange(`${res}p`)}
                            className={`w-full text-left px-3 py-1.5 rounded-md transition-all duration-200 text-sm ${
                              resolution === `${res}p`
                                ? "bg-gray-800/70 backdrop-blur-sm text-white border border-gray-600"
                                : "text-gray-300 hover:bg-gray-800/30 hover:text-white"
                            }`}
                          >
                            {res}p
                          </button>
                        ))}
                        <button
                          onClick={() => handleResolutionChange("Auto")}
                          className={`w-full text-left px-3 py-1.5 rounded-md transition-all duration-200 text-sm ${
                            resolution === "Auto"
                              ? "bg-gray-800/70 backdrop-blur-sm text-white border border-gray-600"
                              : "text-gray-300 hover:bg-gray-800/30 hover:text-white"
                          }`}
                        >
                          Auto
                        </button>
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
  );
}
