"use client"

import type React from "react"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { clamp, toMinutes, type ChangeEntry } from "../components/lib/utils"
import { PauseIcon, PencilIcon, PlayIcon } from "lucide-react"
// import { PlayIcon, PauseIcon, PencilIcon } from "@/components/video-editor/icon"

interface TimelineProps {
    duration: number
    start: number
    setStart: (v: number) => void
    end: number
    setEnd: (v: number) => void
    cursor: number
    setCursor: (v: number) => void
    changes: ChangeEntry[]
    onAddClick: () => void
    onReplaceClick: () => void
    onRemoveClick: () => void
}

export function Timeline({
    duration,
    start,
    setStart,
    end,
    setEnd,
    cursor,
    setCursor,
    changes,
    onAddClick,
    onReplaceClick,
    onRemoveClick,
}: TimelineProps) {
    const railRef = useRef<HTMLDivElement | null>(null)
    const framesCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const thumbVideoRef = useRef<HTMLVideoElement | null>(null)
    const [dragging, setDragging] = useState<null | "start" | "end" | "cursor">(null)
    const dragOffsetRef = useRef(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [showTools, setShowTools] = useState(false)
    const hoverTimerRef = useRef<number | null>(null)

    const startPct = (start / duration) * 100
    const endPct = (end / duration) * 100
    const cursorPct = (cursor / duration) * 100

    const onDownFactory = (kind: "start" | "end" | "cursor") => (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragging(kind)
        dragOffsetRef.current = 0
        const rail = railRef.current
        if (!rail) return
        const rect = rail.getBoundingClientRect()
        const x = e.clientX - rect.left
        let currentPct = 0
        if (kind === "start") currentPct = startPct
        if (kind === "end") currentPct = endPct
        if (kind === "cursor") currentPct = cursorPct
        dragOffsetRef.current = x - (currentPct / 100) * rect.width
    }

    const onMove = useCallback(
        (e: MouseEvent) => {
            if (!dragging) return
            const rail = railRef.current
            if (!rail) return
            const rect = rail.getBoundingClientRect()
            const x = e.clientX - rect.left - dragOffsetRef.current
            const pct = clamp((x / rect.width) * 100, 0, 100)
            const seconds = clamp((pct / 100) * duration, 0, duration)
            if (dragging === "start") {
                const next = Math.min(seconds, end - 0.1)
                setStart(next)
                setCursor(next)
            } else if (dragging === "end") {
                const next = Math.max(seconds, start + 0.1)
                setEnd(next)
                // setCursor((c) => clamp(c, start + 0.1, next - 0.1))
            } else if (dragging === "cursor") {
                const next = clamp(seconds, start + 0.1, end - 0.1)
                setCursor(next)
            }
        },
        [dragging, duration, start, end, setStart, setEnd, setCursor],
    )

    const onUp = useCallback(() => setDragging(null), [])

    useEffect(() => {
        window.addEventListener("mousemove", onMove)
        window.addEventListener("mouseup", onUp)
        return () => {
            window.removeEventListener("mousemove", onMove)
            window.removeEventListener("mouseup", onUp)
        }
    }, [onMove, onUp])

    // Draw frames
    useEffect(() => {
        const rail = railRef.current
        const canvas = framesCanvasRef.current
        const v = thumbVideoRef.current
        if (!rail || !canvas || !v) return

        let cancelled = false
        const draw = async () => {
            const width = Math.max(rail.clientWidth, 320)
            const height = 80
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext("2d")
            if (!ctx) return

            const ready = () =>
                new Promise<void>((r) => {
                    if (v.readyState >= 1) r()
                    else v.addEventListener("loadedmetadata", () => r(), { once: true })
                })

            await ready()
            ctx.clearRect(0, 0, width, height)

            const frames = Math.min(60, Math.max(12, Math.floor(width / 32)))
            for (let i = 0; i < frames && !cancelled; i++) {
                const t = (i / (frames - 1)) * Math.max(0.01, duration - 0.05)
                await new Promise<void>((resolve) => {
                    const onSeeked = () => {
                        if (cancelled) return resolve()
                        const w = (height * v.videoWidth) / Math.max(1, v.videoHeight)
                        const x = Math.round((i / (frames - 1)) * (width - w))
                        try {
                            ctx.drawImage(v, x, 0, w || 1, height)
                        } catch {
                            // ignore
                        }
                        resolve()
                    }
                    v.currentTime = t
                    v.addEventListener("seeked", onSeeked, { once: true })
                })
            }
        }

        void draw()

        const ro = new ResizeObserver(() => void draw())
        ro.observe(rail)

        return () => {
            cancelled = true
            ro.disconnect()
        }
    }, [duration])

    const onToolsEnter = () => {
        if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current)
        setShowTools(true)
    }

    const onToolsLeave = () => {
        hoverTimerRef.current = window.setTimeout(() => setShowTools(false), 1000)
    }

    const sortedChanges = useMemo(() => [...changes].sort((a, b) => a.start - b.start), [changes])

    return (
        <Card className="bg-card/60 backdrop-blur-sm h-full flex flex-col overflow-hidden">
            <div className="p-4 flex flex-col h-full overflow-hidden">
                <div className="mb-4 flex items-center justify-between flex-shrink-0">
                    <h2 className="text-lg font-semibold">Timeline</h2>
                    <span className="text-sm text-muted-foreground">Duration: {toMinutes(duration)}</span>
                </div>

                <div className="relative select-none flex-1 overflow-hidden flex flex-col">
                    {/* Frame rail with color overlays */}
                    <div
                        ref={railRef}
                        className="relative h-24 w-full overflow-hidden rounded-lg border border-border bg-muted flex-shrink-0"
                    >
                        <canvas ref={framesCanvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

                        {/* Color overlays for changes */}
                        {sortedChanges.map((c) => {
                            const left = (c.start / duration) * 100
                            const width = Math.max(0.5, ((c.end - c.start) / duration) * 100)
                            const bgColor =
                                c.type === "add"
                                    ? "rgba(34, 197, 94, 0.3)"
                                    : c.type === "replace"
                                        ? "rgba(59, 130, 246, 0.3)"
                                        : "rgba(239, 68, 68, 0.3)"
                            return (
                                <div
                                    key={c.id}
                                    className="absolute top-0 h-full"
                                    style={{
                                        left: `${left}%`,
                                        width: `${width}%`,
                                        backgroundColor: bgColor,
                                        borderLeft: `2px solid ${c.type === "add" ? "#22c55e" : c.type === "replace" ? "#3b82f6" : "#ef4444"
                                            }`,
                                    }}
                                    title={`${c.type.toUpperCase()}: ${toMinutes(c.start)} → ${toMinutes(c.end)}`}
                                />
                            )
                        })}

                        {/* Dimmed areas outside selection */}
                        <div className="absolute inset-y-0 left-0 bg-background/50" style={{ width: `${startPct}%` }} aria-hidden />
                        <div
                            className="absolute inset-y-0 right-0 bg-background/50"
                            style={{ width: `${100 - endPct}%` }}
                            aria-hidden
                        />

                        {/* Selection highlight */}
                        <div
                            className="absolute top-0 h-full rounded-md ring-1"
                            style={{
                                left: `${startPct}%`,
                                width: `${Math.max(0, endPct - startPct)}%`,
                                backgroundColor: "color-mix(in oklch, var(--color-primary) 12%, transparent)",
                                boxShadow: "inset 0 0 0 1px color-mix(in oklch, var(--color-primary) 40%, transparent)",
                            }}
                        />

                        {/* Start handle */}
                        <div
                            role="slider"
                            aria-label="Selection start"
                            aria-valuemin={0}
                            aria-valuemax={duration}
                            aria-valuenow={start}
                            tabIndex={0}
                            className="absolute top-0 h-full w-4 -translate-x-1/2 cursor-ew-resize"
                            style={{ left: `${startPct}%` }}
                            onMouseDown={onDownFactory("start")}
                        >
                            <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-green-500"></div>
                            <div className="absolute top-1 left-1/2 h-[2px] w-3 -translate-x-1/2 bg-green-500"></div>
                            <div className="absolute bottom-1 left-1/2 h-[2px] w-3 -translate-x-1/2 bg-green-500"></div>
                        </div>

                        {/* Cursor */}
                        <div
                            role="slider"
                            aria-label="Cursor"
                            aria-valuemin={0}
                            aria-valuemax={duration}
                            aria-valuenow={cursor}
                            tabIndex={0}
                            className="absolute top-0 h-full -translate-x-1/2 cursor-ew-resize"
                            style={{
                                left: `${cursorPct}%`,
                                top: -2,
                                height: "calc(100% + 4px)",
                                borderLeft: "2px dotted rgba(255,255,255,0.85)",
                                filter: "drop-shadow(0 0 1px rgba(255,255,255,0.5))",
                            }}
                            onMouseDown={onDownFactory("cursor")}
                        />

                        {/* End handle */}
                        <div
                            role="slider"
                            aria-label="Selection end"
                            aria-valuemin={0}
                            aria-valuemax={duration}
                            aria-valuenow={end}
                            tabIndex={0}
                            className="absolute top-0 h-full w-4 -translate-x-1/2 cursor-ew-resize"
                            style={{ left: `${endPct}%` }}
                            onMouseDown={onDownFactory("end")}
                        >
                            <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-red-500"></div>
                            <div className="absolute top-1 left-1/2 h-[2px] w-3 -translate-x-1/2 bg-red-500"></div>
                            <div className="absolute bottom-1 left-1/2 h-[2px] w-3 -translate-x-1/2 bg-red-500"></div>
                        </div>
                    </div>

                    {/* Time labels */}
                    <div
                        className="absolute -top-6 z-20 rounded-md border border-border bg-popover/90 px-2 py-1 text-xs shadow-sm"
                        style={{ left: `${cursorPct}%`, transform: "translateX(-50%)" }}
                    >
                        {toMinutes(cursor)}
                    </div>
                    <div
                        className="absolute -bottom-6 z-20 rounded-md border border-border bg-popover/90 px-2 py-1 text-xs shadow-sm"
                        style={{ left: `${startPct}%`, transform: "translateX(-50%)" }}
                    >
                        {toMinutes(start)}
                    </div>
                    <div
                        className="absolute -bottom-6 z-20 rounded-md border border-border bg-popover/90 px-2 py-1 text-xs shadow-sm"
                        style={{ left: `${endPct}%`, transform: "translateX(-50%)" }}
                    >
                        {toMinutes(end)}
                    </div>

                    {/* Cursor tools */}
                    <div
                        className="absolute z-50"
                        style={{ left: `${cursorPct}%`, top: "100%", transform: "translate(-50%, 16px)" }}
                        onMouseEnter={onToolsEnter}
                        onMouseLeave={onToolsLeave}
                    >
                        <div className="flex items-center gap-2">
                            <button
                                className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card/90 shadow-sm hover:bg-accent/60"
                                aria-label={isPlaying ? "Pause" : "Play"}
                                onClick={() => {
                                    setIsPlaying(!isPlaying)
                                }}
                            >
                                {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                            </button>
                            <button className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card/90 shadow-sm hover:bg-accent/60">
                                <PencilIcon className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Hover tools */}
                        <div
                            className={`absolute left-1/2 mt-2 -translate-x-1/2 rounded-xl border border-border bg-popover px-3 py-2 shadow-xl backdrop-blur-md transition-opacity ${showTools ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                                }`}
                        >
                            <div className="mb-2 text-xs font-medium">Choose action</div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={onAddClick}
                                    className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={onReplaceClick}
                                    className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                                >
                                    Replace
                                </button>
                                <button
                                    onClick={onRemoveClick}
                                    className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>

                    <video ref={thumbVideoRef} className="hidden" src="/videos/sample.mp4" preload="metadata" muted />
                </div>
            </div>
        </Card>
    )
}
