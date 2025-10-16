"use client"

import { useState } from "react"
import { toMinutes, type ChangeEntry } from "../components/lib/utils"
import { ChevronDownIcon } from "lucide-react"

interface ChangesDrawerProps {
    open: boolean
    onOpenChange: (v: boolean) => void
    changes: ChangeEntry[]
}

export function ChangesDrawer({ open, onOpenChange, changes }: ChangesDrawerProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const sortedChanges = [...changes].sort((a, b) => a.start - b.start)

    const getChangeColor = (type: string) => {
        switch (type) {
            case "add":
                return "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-400"
            case "replace":
                return "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-400"
            case "remove":
                return "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-400"
            default:
                return ""
        }
    }

    return (
        <>
            {/* Overlay */}
            {open && <div className="fixed inset-0 z-40 bg-black/50" onClick={() => onOpenChange(false)} />}

            {/* Drawer */}
            <div
                className={`fixed right-0 top-0 z-50 h-full w-80 transform bg-background shadow-lg transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="border-b border-border p-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Changes</h2>
                            <button onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground">
                                ✕
                            </button>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {sortedChanges.length} change{sortedChanges.length !== 1 ? "s" : ""} made
                        </p>
                    </div>

                    {/* Changes list */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {sortedChanges.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No changes yet</p>
                        ) : (
                            <div className="space-y-2">
                                {sortedChanges.map((change, index) => (
                                    <div key={change.id} className="rounded-lg border border-border">
                                        <button
                                            onClick={() => setExpandedId(expandedId === change.id ? null : change.id)}
                                            className="w-full p-3 text-left hover:bg-accent/50"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`inline-block rounded px-2 py-1 text-xs font-semibold ${getChangeColor(
                                                            change.type,
                                                        )}`}
                                                    >
                                                        {change.type.toUpperCase()}
                                                    </span>
                                                    <div>
                                                        <p className="text-sm font-medium">Change #{index + 1}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {toMinutes(change.start)} → {toMinutes(change.end)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <ChevronDownIcon
                                                    className={`h-4 w-4 transition-transform ${expandedId === change.id ? "rotate-180" : ""}`}
                                                />
                                            </div>
                                        </button>

                                        {/* Expanded content */}
                                        {expandedId === change.id && (
                                            <div className="border-t border-border p-3">
                                                {(change.type === "add" || change.type === "replace") && (
                                                    <div className="mb-3">
                                                        <p className="mb-2 text-xs font-medium text-muted-foreground">Preview</p>
                                                        <div className="rounded-lg border border-border bg-muted p-2">
                                                            <video
                                                                className="h-auto w-full rounded"
                                                                style={{ aspectRatio: "16/9" }}
                                                                src="/videos/sample.mp4"
                                                                controls
                                                                muted
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="space-y-2 text-xs">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Start:</span>
                                                        <span className="font-medium">{toMinutes(change.start)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">End:</span>
                                                        <span className="font-medium">{toMinutes(change.end)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Duration:</span>
                                                        <span className="font-medium">{toMinutes(change.end - change.start)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
