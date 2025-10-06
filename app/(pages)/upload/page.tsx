"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Search, Video, Upload, Plus, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";

export default function VideoUploadPage() {
  const [title, setTitle] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(
    null
  );

  const uploadProcess = async () => {
    const uploadVideo = () => {};
    const uploadThumbnail = () => {};

    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const {
        data: {
          result:{uploadUrl},
        },
      } = await axios.post(
        `http://localhost:1234/api/v1/video/upload`,
        {
          commitMessage: "Init Video",
          branch: "main", // default branch
          workspace:"9736831a-2072-4570-8444-1fe65c510ac2", // should be workspace id, not just name
          contentType: selectedFile.type,
        }
      );

      await axios.put(uploadUrl, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type,
        },
        onUploadProgress: ({ progress }) => {
          if (progress) {
            const percent = Math.round(progress * 100);
            setUploadProgress(percent);
          }
        },
      });
      
      setIsUploading(false);
      setUploadProgress(100);
    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      setUploadProgress(0);
    }
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
      const url = URL.createObjectURL(file);
      setThumbnailPreviewUrl(url);
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

  return (
    <div className="h-screen bg-[#0A0A0A] text-white animate-fade-in flex flex-col overflow-hidden">
      {selectedFile && (
        <div className="fixed top-22 right-2 z-50 bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 shadow-2xl animate-slide-in-right">
          <div className="flex flex-col space-y-2">
            <div className="text-sm text-gray-300">
              <span className="text-[#00D4AA] font-semibold">Name:</span>{" "}
              {selectedFile.name}
            </div>
            <div className="text-sm text-gray-300">
              <span className="text-[#00D4AA] font-semibold">Size:</span>{" "}
              {formatFileSize(selectedFile.size)}
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {isUploading && (
        <div className="fixed bottom-0 left-0 w-full z-50 animate-slide-up">
          <div className="w-full bg-[#0b0d10fc] backdrop-blur-sm border-t border-gray-700/50 p-6 shadow-2xl">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00D4AA] to-[#00B894] rounded-full flex items-center justify-center animate-pulse">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Uploading Video
                    </h3>
                    <p className="text-sm text-gray-400">
                      {selectedFile?.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#00D4AA]">
                    {uploadProgress}%
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatFileSize(selectedFile?.size || 0)}
                  </div>
                </div>
              </div>

              <div className="w-full max-w-4xl mx-auto">
                <Slider
                  value={[uploadProgress]}
                  max={100}
                  step={0.1}
                  disabled
                  className="progress-slider w-full h-4 transition-all duration-700 ease-out"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="h-[8vh] bg-black sticky top-0 z-50 shadow-2xl border-b border-gray-800/50">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-[#00D4AA]">VC Engine</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search projects..."
                className="w-60 pl-10 bg-gray-900 border-gray-700 focus:border-[#00D4AA] transition-all duration-300 rounded-full text-sm"
              />
            </div>
            <Avatar className="w-8 h-8 ring-2 ring-[#00D4AA]/30 hover:ring-[#00D4AA]/60 transition-all duration-300 cursor-pointer">
              <AvatarImage src="/placeholder-user.png" />
              <AvatarFallback className="bg-[#00D4AA] text-white font-semibold text-sm">
                JD
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 px-6 py-6 animate-fade-up overflow-hidden flex flex-col">
        <div
          className={`mx-auto flex-1 transition-all duration-700 ease-in-out ${
            videoPreviewUrl ? "max-w-[90%]" : "max-w-7xl"
          }`}
        >
          <div className="h-full flex flex-col space-y-4">
            <div className="text-center animate-fade-up border-b border-gray-800/30 pb-6">
              <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <Video className="w-10 h-10 text-[#00D4AA]" />
                Video Upload Studio
              </h1>
              <p className="text-lg text-gray-400">
                Upload and manage your video content with custom thumbnails
              </p>
            </div>

            <div className="flex gap-8 items-start transition-all duration-700 ease-in-out">
              {/* Left side - Video Upload */}
              <div
                className={`flex flex-col space-y-4 border border-gray-800/50 rounded-xl p-6 bg-gray-900/20 transition-all duration-700 ease-in-out h-auto ${
                  videoPreviewUrl ? "flex-[3] w-[75vw]" : "flex-1 w-[40vw]"
                }`}
              >
                <div className="animate-slide-right">
                  <label className="block text-base font-medium text-gray-300 mb-2">
                    Video Title
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your video title..."
                    className="h-12 text-lg bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-[#00D4AA] focus:ring-[#00D4AA]/20 focus:shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-all duration-300 hover:bg-gray-700/50"
                  />
                </div>

                <div className="animate-slide-right">
                  <label className="block text-base font-medium text-gray-300 mb-2">
                    Workspace
                  </label>
                  <Input
                    value={workspace}
                    onChange={(e) => setWorkspace(e.target.value)}
                    placeholder="Enter your workspace name..."
                    className="h-12 text-lg bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-[#00D4AA] focus:ring-[#00D4AA]/20 focus:shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-all duration-300 hover:bg-gray-700/50"
                  />
                </div>

                {/* Video Upload Area */}
                <div className="relative flex-1">
                  {videoPreviewUrl ? (
                    <div className="w-full transition-all duration-700 h-[32rem] rounded-xl overflow-hidden border border-[#00D4AA]/50 shadow-[0_0_30px_rgba(0,212,170,0.25)] relative group">
                      <video
                        src={videoPreviewUrl}
                        controls
                        className="w-full h-full object-contain bg-black"
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>

                      {/* Hover overlay with Replace Video button */}
                      {/* <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <Button
                            size="sm"
                            className="bg-[#00D4AA] hover:bg-[#00B894] text-white"
                          >
                            Replace Video
                          </Button>
                        </label>
                      </div> */}
                    </div>
                  ) : (
                    <label className="w-full h-48 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center hover:border-[#00D4AA] hover:bg-[#00D4AA]/5 transition-all duration-300 group hover:scale-105 cursor-pointer">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:bg-[#00D4AA]/20 transition-all duration-300">
                          <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#00D4AA] transition-colors" />
                        </div>
                        <div className="text-lg font-medium text-white mb-1">
                          Add Video
                        </div>
                        <div className="text-sm text-gray-400">
                          Click to upload video
                        </div>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Right side - Thumbnail Upload */}
              <div>
                <div
                  className={`flex flex-col space-y-4 border border-gray-800/50 rounded-xl p-6 bg-gray-900/20 transition-all duration-700 ease-in-out h-auto ${
                    thumbnailPreviewUrl ? "w-[36rem]" : "w-80"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="w-5 h-5 text-[#00D4AA]" />
                    <h2 className="text-xl font-semibold text-white">
                      Thumbnail
                    </h2>
                  </div>

                  <div className="relative flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />

                    {thumbnailPreviewUrl ? (
                      <div className="w-full h-72 rounded-xl  overflow-hidden border border-[#00D4AA]/50 shadow-[0_0_30px_rgba(0,212,170,0.25)] relative group transition-all duration-700">
                        <img
                          src={thumbnailPreviewUrl || "/placeholder.svg"}
                          alt="Thumbnail preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center hover:border-[#00D4AA] hover:bg-[#00D4AA]/5 transition-all duration-300 group hover:scale-105">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:bg-[#00D4AA]/20 transition-all duration-300">
                            <Plus className="w-6 h-6 text-gray-400 group-hover:text-[#00D4AA] transition-colors" />
                          </div>
                          <div className="text-lg font-medium text-white mb-1">
                            Add Thumbnail
                          </div>
                          <div className="text-sm text-gray-400">
                            Click to upload image
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {thumbnailFile && (
                    <div className="text-center p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                      <div className="text-sm text-gray-300 truncate">
                        {thumbnailFile.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatFileSize(thumbnailFile.size)}
                      </div>
                    </div>
                  )}
                </div>
                {/* Upload Button */}
                {selectedFile && videoPreviewUrl && (
                  <div className="flex justify-center py-6 mt-12">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-[#00D4AA] to-[#00B894] hover:from-[#00C4A0] hover:to-[#00A085] text-white font-bold text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-[0_0_40px_rgba(0,212,170,0.5)] transition-all duration-300 transform hover:scale-110 animate-pulse-glow-button"
                      onClick={uploadProcess}
                    >
                      <Upload className="w-5 h-5 mr-2 animate-bounce-subtle" />
                      Upload Video
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
