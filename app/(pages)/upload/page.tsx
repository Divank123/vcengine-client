"use client";

import type React from "react";

import { useState } from "react";
import { Search, User, Play, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VideoUploadPage() {
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  const uploadVideo = () => {
    console.log({ title, selectedFile });
    // uploading backend route : http://localhost:1234/video/upload
  };
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
    }
  };

  const handleThumbnailSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-screen bg-[#0D0D0D] text-white animate-fade-in flex flex-col overflow-hidden">
      <nav className="bg-[#0D0D0D] h-16 flex-shrink-0 animate-slide-down">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ff6a00] to-[#ff8533] rounded-lg flex items-center justify-center animate-bounce-subtle">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold text-[#ff6a00] animate-text-wave">
              CinemaStudio
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4 animate-slide-left">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-11 w-64 h-10 bg-gray-900/50 border-gray-700 text-base text-white placeholder-gray-400 focus:border-[#ff6a00] focus:ring-[#ff6a00]/20 transition-all duration-300 hover:bg-gray-800/50"
              />
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center hover:from-gray-600 hover:to-gray-700 transition-all cursor-pointer hover:scale-110 animate-float">
              <User className="w-6 h-6 text-gray-300" />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 px-6 py-4 animate-fade-up overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          <div className="h-full flex flex-col space-y-4">
            <div className="flex items-end justify-between gap-8 flex-shrink-0">
              {/* Title Input */}
              <div className="flex-1 animate-slide-right">
                <label className="block text-base font-medium text-gray-300 mb-2">
                  Video Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your video title..."
                  className="h-12 text-lg bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-[#ff6a00] focus:ring-[#ff6a00]/20 focus:shadow-[0_0_20px_rgba(255,106,0,0.3)] transition-all duration-300 hover:bg-gray-700/50"
                />
              </div>

              <div className="w-48 animate-slide-left opacity-0">
                <label className="block text-base font-medium text-gray-300 mb-2">
                  Thumbnail
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="h-12 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center hover:border-[#ff6a00] hover:bg-[#ff6a00]/5 transition-all duration-300 group hover:scale-105">
                    {thumbnailFile ? (
                      <div className="text-center">
                        <div className="text-sm text-gray-400 truncate max-w-[140px]">
                          {thumbnailFile.name}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Plus className="w-5 h-5 text-gray-400 group-hover:text-[#ff6a00] transition-colors animate-spin-slow" />
                        <div className="text-sm text-gray-400 group-hover:text-[#ff6a00] transition-colors">
                          Add Image
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-up-delay flex-1 min-h-0">
              {videoPreviewUrl ? (
                <div className="h-full rounded-xl overflow-hidden border border-[#ff6a00]/50 shadow-[0_0_40px_rgba(255,106,0,0.2)] animate-bounce-in">
                  <video
                    src={videoPreviewUrl}
                    controls
                    className="w-full h-full object-cover bg-black"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute top-4 right-4">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Button
                      size="sm"
                      className="bg-black/70 hover:bg-black/90 text-white border border-[#ff6a00]/50 hover:border-[#ff6a00] transition-all duration-300"
                    >
                      Replace Video
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="h-full bg-gradient-to-br from-purple-900/30 via-blue-800/40 to-indigo-900/30 rounded-xl flex items-center justify-center border border-gray-700/50 hover:border-[#ff6a00]/50 transition-all duration-300 group hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,106,0,0.2)] animate-gradient-shift relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                    <div className="text-center relative z-10">
                      <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-[#ff6a00]/20 transition-all duration-300 animate-float">
                        <Upload className="w-10 h-10 text-gray-400 group-hover:text-[#ff6a00] transition-colors animate-bounce-subtle" />
                      </div>
                      <div className="text-2xl font-medium text-white mb-2 animate-glow">
                        Drop your video here
                      </div>
                      <div className="text-lg text-gray-400">
                        or click to browse files
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {selectedFile && (
              <div className="animate-fade-up-delay-2 transition-all duration-700 ease-out transform flex-shrink-0">
                <div className="grid grid-cols-2 gap-6 text-center py-3 bg-gray-900/30 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                  <div className="transform transition-all duration-500 hover:scale-105">
                    <div className="text-gray-300 font-medium text-base">
                      File name:{" "}
                      <span className="text-[#ff6a00] font-semibold">
                        {selectedFile.name}
                      </span>
                    </div>
                  </div>
                  {/* <div className="transform transition-all duration-500 hover:scale-105">
                    <div className="text-gray-300 font-medium text-base">
                      Duration:{" "}
                      <span className="text-[#ff6a00] font-semibold">
                        --:--
                      </span>
                    </div>
                  </div> */}
                  <div className="transform transition-all duration-500 hover:scale-105">
                    <div className="text-gray-300 font-medium text-base">
                      Size:{" "}
                      <span className="text-[#ff6a00] font-semibold">
                        {formatFileSize(selectedFile.size)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Upload Button - Only show when file is selected */}
                <div className="flex justify-center pt-4 animate-bounce-in-delay">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#ff6a00] to-[#ff8533] hover:from-[#ff5500] hover:to-[#ff6a00] text-white font-bold text-lg px-16 py-4 rounded-xl shadow-lg hover:shadow-[0_0_40px_rgba(255,106,0,0.5)] transition-all duration-300 transform hover:scale-110 animate-pulse-glow-button"
                    onClick={uploadVideo}
                  >
                    <Upload className="w-6 h-6 mr-3 animate-bounce-subtle" />
                    Upload Video
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
