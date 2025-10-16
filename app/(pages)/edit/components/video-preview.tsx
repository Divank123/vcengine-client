"use client"

import { useRef, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import type { ChangeEntry } from "../components/lib/utils"

interface VideoPreviewProps {
    duration: number
    changes: ChangeEntry[],
    videoUrl: string
}

export function VideoPreview({ duration, changes }: VideoPreviewProps) {
    const originalVideoRef = useRef<HTMLVideoElement | null>(null)
    const editedVideoRef = useRef<HTMLVideoElement | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        const handleEnded = () => setIsPlaying(false)
        const videos = [originalVideoRef.current, editedVideoRef.current]
        videos.forEach((v) => {
            if (v) v.addEventListener("ended", handleEnded)
        })
        return () => {
            videos.forEach((v) => {
                if (v) v.removeEventListener("ended", handleEnded)
            })
        }
    }, [])

    const togglePlayPause = () => {
        const videos = [originalVideoRef.current, editedVideoRef.current]
        if (isPlaying) {
            videos.forEach((v) => v?.pause())
            setIsPlaying(false)
        } else {
            videos.forEach((v) => v?.play())
            setIsPlaying(true)
        }
    }

    return (
        <Card className="bg-card/60 backdrop-blur-sm h-full flex flex-col">
            <div className="p-4 flex flex-col h-[50vh]">
                <div className="mb-4 flex items-center justify-between flex-shrink-0">
                    <h2 className="text-lg font-semibold">Preview</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={togglePlayPause}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            {isPlaying ? "Pause" : "Play"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
                    {/* Original Video */}
                    <div className="flex flex-col">
                        <div className="mb-2 text-sm font-medium text-muted-foreground flex-shrink-0">Original</div>
                        <div className="relative overflow-hidden rounded-lg border border-border bg-muted flex-1">
                            <video ref={originalVideoRef} className="h-full w-full object-contain" src="/videos/sample.mp4" muted />
                        </div>
                    </div>

                    {/* Edited Video */}
                    <div className="flex flex-col">
                        <div className="mb-2 text-sm font-medium text-muted-foreground flex-shrink-0">Edited</div>
                        <div className="relative overflow-hidden rounded-lg border border-border bg-muted flex-1">
                            <video ref={editedVideoRef} className="h-full w-full object-contain" src="/videos/sample.mp4" muted />
                        </div>
                    </div>
                </div>

                {/* Changes indicator */}
                {changes.length > 0 && (
                    <div className="mt-4 rounded-lg bg-accent/20 p-3 flex-shrink-0">
                        <p className="text-sm text-muted-foreground">
                            {changes.length} change{changes.length !== 1 ? "s" : ""} applied to edited video
                        </p>
                    </div>
                )}
            </div>
        </Card>
    )
}
