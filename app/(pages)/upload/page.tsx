"use client"

import type React from "react"
import { useState, useRef } from "react"
import axios from "axios"
import { ArrowRight, Sparkles, Upload, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { requestHandler } from "@/lib/requestHandler"
import { useRouter } from "next/navigation"

type UploadState = {
  workspace: string
  branch: string
  videoFile: File | null
  thumbnailFile: File | null
}

export default function VideoUploadPage() {
  const rotuer = useRouter()
  const [form, setForm] = useState<UploadState>({
    workspace: "",
    branch: "",
    videoFile: null,
    thumbnailFile: null,
  })

  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null)
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null)
  const [thumbLoaded, setThumbLoaded] = useState(false)
  const [thumbError, setThumbError] = useState<string | null>(null)

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showUploadDialog, setShowUploadDialog] = useState(false)

  const [step, setStep] = useState(1)
  const [isPrivate, setIsPrivate] = useState(true)

  const thumbInputRef = useRef<HTMLInputElement>(null)

  const handleInput = (key: keyof UploadState, value: string | File | null) => {
    setForm((prev) => ({ ...prev, [key]: value as any }))
  }

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    handleInput("videoFile", file)
    setVideoPreviewUrl(URL.createObjectURL(file))
  }

  const handleThumbSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const MAX_THUMB_SIZE = 5 * 1024 * 1024 // 5 MB
    if (file.size > MAX_THUMB_SIZE) {
      setThumbError("Max thumbnail size is 5 MB.")
      // clear selection
      e.currentTarget.value = ""
      handleInput("thumbnailFile", null)
      setThumbnailPreviewUrl(null)
      return
    }
    setThumbError(null)
    handleInput("thumbnailFile", file)
    setThumbLoaded(false) // reset animation state before new preview
    setThumbnailPreviewUrl(URL.createObjectURL(file))
  }

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  const uploadProcess = async () => {
    if (!form.videoFile) return
    setIsUploading(true)
    setUploadProgress(0)
    setShowUploadDialog(true)

    let bannerKey: string | null = null

    // Thumbnail Upload
    if (form.thumbnailFile) {
      requestHandler({
        url: "/get-signed-url",
        method: "POST",
        body: {
          contentType: form.thumbnailFile?.type,
          type: "banner",
        },
        action: async ({ uploadUrl, fileKey }: any) => {
          await axios.put(uploadUrl, form.thumbnailFile, {
            headers: {
              "Content-Type": form.thumbnailFile?.type,
            },
            onUploadProgress: (evt) => {
              if (!evt.total) return
              const percent = Math.round((evt.loaded / evt.total) * 100)
              setUploadProgress(percent)
            },
          })

          bannerKey = fileKey
        }
      })
    }

    // Workspace & Branch Create
    requestHandler({
      url: "/workspace",
      method: "POST",
      body: {
        name: form.workspace,
        branchName: form.branch,
        type: isPrivate ? "Private" : "Public",
        banner: bannerKey
      },
      action: ({ branchId,
        workspaceId }: any) => {




        // Video Upload
        requestHandler({
          url: "/video/upload",
          method: 'POST',
          body: {
            contentType: form.videoFile?.type,
            commitMessage: "init",
            workspace: workspaceId,
            branch: branchId,
          },
          action: async ({ uploadUrl }: any) => {
            await axios.put(uploadUrl, form.videoFile, {
              headers: { "Content-Type": form.videoFile?.type },
              onUploadProgress: (evt) => {
                const total = evt.total || form.videoFile?.size || 0
                const loaded = evt.loaded || 0
                const percent = total ? Math.round((loaded / total) * 100) : 0
                setUploadProgress(percent)
              },
            })

            setShowUploadDialog(false)
            rotuer.push('/dashboard')
          }
        })
      }
    })


    // try {
    //   const { data } = await axios.post("/api/v1/video/upload", {
    //     commitMessage: "Init Video",
    //     branch: form.branch,
    //     workspace: form.workspace,
    //     contentType: form.videoFile.type,
    //     isPrivate: isPrivate,
    //   })

    //   const uploadUrl: string | undefined = data?.result?.uploadUrl
    //   if (!uploadUrl) throw new Error("No upload URL returned")

    //   await axios.put(uploadUrl, form.videoFile, {
    //     headers: { "Content-Type": form.videoFile.type },
    //     onUploadProgress: (evt) => {
    //       const total = evt.total || form.videoFile?.size || 0
    //       const loaded = evt.loaded || 0
    //       const percent = total ? Math.round((loaded / total) * 100) : 0
    //       setUploadProgress(percent)
    //     },
    //   })

    //   // Optionally upload thumbnail if present (example placeholder; depends on your backend)
    //   // if (form.thumbnailFile) { ... }

    //   setUploadProgress(100)
    // } catch (err) {
    //   console.error("[v0] Upload error:", err)
    //   // keep dialog open to show current progress state; could add toast if project uses it
    // } finally {
    //   setIsUploading(false)
    //   // keep dialog visible briefly so users see completion; close after short delay
    //   setTimeout(() => setShowUploadDialog(false), 600)
    // }
  }

  return (
    <main className="min-h-screen relative overflow-hidden grid items-center" >
      {/* Content layout mirrors signup/login */}
      <section className="px-6 md:px-12 lg:px-20 pb-16" >
        <div className="w-full max-w-5xl mx-auto">
          <div className="relative">
            {/* Upload container (primary focus) */}
            <Card className="bg-card/80 backdrop-blur border-border/60 shadow-2xl">
              <CardHeader className="space-y-2 text-center">
                <CardTitle className="text-2xl">Upload Video</CardTitle>
                <CardDescription>Step {step} of 3</CardDescription>

                {/* Step indicator */}
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className={`size-6 rounded-full grid place-content-center text-xs border transition-colors ${step >= 1
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border"
                        }`}
                    >
                      1
                    </div>
                    <span className={`text-xs ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
                      Details
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className={`size-6 rounded-full grid place-content-center text-xs border transition-colors ${step >= 2
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border"
                        }`}
                    >
                      2
                    </div>
                    <span className={`text-xs ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
                      Thumbnail
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className={`size-6 rounded-full grid place-content-center text-xs border transition-colors ${step >= 3
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border"
                        }`}
                    >
                      3
                    </div>
                    <span className={`text-xs ${step >= 3 ? "text-foreground" : "text-muted-foreground"}`}>Video</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* STEP 1: Details (workspace + branch) */}
                {step === 1 && (
                  <div className="space-y-4 transition-all duration-300">
                    <div className="flex items-center justify-between rounded-lg bg-card/60 border border-border px-3 py-3">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Workspace Visibility</div>
                        <div className="text-xs text-muted-foreground">
                          {isPrivate ? "Private (only you can access)" : "Public (anyone with link can view)"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${isPrivate ? "text-foreground" : "text-muted-foreground"}`}>
                          Private
                        </span>
                        <Switch checked={isPrivate} onCheckedChange={setIsPrivate} aria-label="Toggle visibility" />
                        <span className={`text-xs ${!isPrivate ? "text-foreground" : "text-muted-foreground"}`}>
                          Public
                        </span>
                      </div>
                    </div>

                    {/* Workspace input follows the toggle as requested */}
                    <div className="space-y-2">
                      <Label htmlFor="workspace" className="text-sm font-medium">
                        Workspace
                      </Label>
                      <Input
                        id="workspace"
                        type="text"
                        placeholder="Enter your workspace ID"
                        value={form.workspace}
                        onChange={(e) => handleInput("workspace", e.target.value)}
                        className="bg-input border-border focus:border-primary transition-colors hover:border-primary/50"
                        required
                      />
                    </div>

                    {/* Branch input */}
                    <div className="space-y-2">
                      <Label htmlFor="branch" className="text-sm font-medium">
                        Branch
                      </Label>
                      <Input
                        id="branch"
                        type="text"
                        placeholder="e.g. main or feature/video-edit"
                        value={form.branch}
                        onChange={(e) => handleInput("branch", e.target.value)}
                        className="bg-input border-border focus:border-primary transition-colors hover:border-primary/50"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-border hover:border-primary/50 bg-transparent"
                        onClick={() => setStep(2)}
                        disabled={!form.workspace || !form.branch}
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Thumbnail/Banner */}
                {step === 2 && (
                  <div className="space-y-4 transition-all duration-300">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Thumbnail/Banner (optional)</Label>

                      {!thumbnailPreviewUrl && (
                        <label className="w-full h-40 md:h-48 rounded-lg border border-dashed border-border grid place-content-center text-center cursor-pointer hover:border-primary/50 hover:bg-card/60 transition-colors">
                          <input
                            id="thumb-input"
                            ref={thumbInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleThumbSelect}
                            className="sr-only"
                          />
                          <div className="flex flex-col items-center gap-2">
                            <div className="size-10 rounded-full bg-muted/40 grid place-content-center">
                              <ImageIcon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="text-sm">Click to upload thumbnail</div>
                            <div className="text-xs text-muted-foreground">Max 5 MB • JPG, PNG, WEBP</div>
                          </div>
                        </label>
                      )}

                      {thumbError && <div className="text-xs text-destructive">{thumbError}</div>}

                      {form.thumbnailFile && (
                        <div className="text-xs text-muted-foreground flex items-center justify-between">
                          <span className="truncate">{form.thumbnailFile.name}</span>
                          <span>{formatFileSize(form.thumbnailFile.size)}</span>
                        </div>
                      )}

                      {thumbnailPreviewUrl && (
                        <div className="mt-3 w-[40%] md:w-[30%] min-w-[180px] rounded-lg overflow-hidden border border-border bg-card/60 animate-modal-pop">
                          <img
                            src={
                              thumbnailPreviewUrl || "/placeholder.svg?height=320&width=568&query=thumbnail%20preview"
                            }
                            alt="Thumbnail preview"
                            className={`h-auto w-full object-cover aspect-video ${thumbLoaded ? "thumb-fade-in" : "opacity-0"}`}
                            onLoad={() => setThumbLoaded(true)}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-border hover:border-primary/50 bg-transparent"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>

                      <div className="ml-auto flex items-center gap-2">
                        {thumbnailPreviewUrl && (
                          <Button
                            type="button"
                            variant="outline"
                            className="border-border hover:border-primary/50 bg-transparent"
                            onClick={() => {
                              thumbInputRef.current?.click()
                            }}
                          >
                            Replace
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          className="border-border hover:border-primary/50 bg-transparent"
                          onClick={() => setStep(3)}
                        >
                          Next
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Video */}
                {step === 3 && (
                  <div className="space-y-4 transition-all duration-300">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Video File</Label>
                      {videoPreviewUrl ? (
                        <div className="rounded-lg overflow-hidden border border-primary/40 bg-card/60">
                          <video
                            src={videoPreviewUrl}
                            controls
                            className="video-skin w-full aspect-video max-h-[70vh] object-contain bg-background"
                            preload="metadata"
                          />
                        </div>
                      ) : (
                        <label className="w-full h-48 md:h-64 lg:h-80 rounded-lg border border-dashed border-border grid place-content-center text-center cursor-pointer hover:border-primary/50 hover:bg-card/60 transition-colors">
                          <Input type="file" accept="video/*" onChange={handleVideoSelect} className="sr-only" />
                          <div className="flex flex-col items-center gap-2">
                            <div className="size-10 rounded-full bg-muted/40 grid place-content-center">
                              <Upload className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="text-sm">Click to upload video</div>
                          </div>
                        </label>
                      )}

                      {form.videoFile && (
                        <div className="text-xs text-muted-foreground flex items-center justify-between">
                          <span className="truncate">{form.videoFile.name}</span>
                          <span>{formatFileSize(form.videoFile.size)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-border hover:border-primary/50 bg-transparent"
                        onClick={() => setStep(2)}
                      >
                        Back
                      </Button>

                      {/* Upload button with shimmer like signup/login */}
                      <Button
                        type="button"
                        onClick={uploadProcess}
                        disabled={!form.videoFile || isUploading}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 group relative overflow-hidden disabled:opacity-60"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <div className="flex items-center gap-2">
                          {isUploading ? "Uploading..." : "Upload Video"}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>


        </div>
      </section >

      {/* Upload progress dialog (matches signup's dialog pattern) */}
      < Dialog open={showUploadDialog} >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Uploading video</DialogTitle>
            <DialogDescription>Your file is being uploaded to secure storage.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Progress value={uploadProgress} />
            <div className="text-sm text-muted-foreground text-right">{uploadProgress}%</div>
          </div>
        </DialogContent>
      </Dialog >
    </main >
  )
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
}) {
  return (
    <div className="p-4 rounded-lg bg-card/60 border border-border/60 hover:border-primary/40 hover:bg-card/80 transition-colors">
      <Icon className="w-5 h-5 text-primary mb-2" />
      <div className="font-medium">{title}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
  )
}