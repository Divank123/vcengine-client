"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TimeRow } from "../shared/time-row"
import { toMinutes } from "../lib/utils"

interface RemoveDialogProps {
    open: boolean
    onOpenChange: (v: boolean) => void
    removeManual: boolean
    setRemoveManual: (v: boolean) => void
    removeStartSec: string
    setRemoveStartSec: (v: string) => void
    removeStartMs: string
    setRemoveStartMs: (v: string) => void
    removeEndSec: string
    setRemoveEndSec: (v: string) => void
    removeEndMs: string
    setRemoveEndMs: (v: string) => void
    submitAuto: () => void
    submitManual: () => void
    currentStart: number
    currentEnd: number
}

export function RemoveDialog(props: RemoveDialogProps) {
    const {
        open,
        onOpenChange,
        removeManual,
        setRemoveManual,
        removeStartSec,
        setRemoveStartSec,
        removeStartMs,
        setRemoveStartMs,
        removeEndSec,
        setRemoveEndSec,
        removeEndMs,
        setRemoveEndMs,
        submitAuto,
        submitManual,
        currentStart,
        currentEnd,
    } = props

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Remove section</DialogTitle>
                    <DialogDescription>Permanently mark a segment as removed.</DialogDescription>
                </DialogHeader>

                {!removeManual && (
                    <div className="space-y-3">
                        <div className="rounded-lg border border-border p-3">
                            <div className="text-sm font-medium">Auto remove</div>
                            <p className="text-xs text-destructive">
                                Are you sure you want to remove: <strong>{toMinutes(currentStart)}</strong> →{" "}
                                <strong>{toMinutes(currentEnd)}</strong>?
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                                <Button variant="destructive" className="flex-1" onClick={submitAuto}>
                                    Remove
                                </Button>
                                <Button variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>

                        <div className="text-center text-xs">
                            <button
                                className="text-primary underline underline-offset-4 hover:text-primary/80"
                                onClick={() => setRemoveManual(true)}
                            >
                                Remove manually
                            </button>
                        </div>
                    </div>
                )}

                {removeManual && (
                    <div className="space-y-3">
                        <div className="rounded-lg border border-border p-3">
                            <div className="text-sm font-medium">Remove with specific time</div>
                            <p className="text-xs text-muted-foreground">Provide start and end time in minutes and seconds.</p>
                            <TimeRow
                                label="Start time"
                                sec={removeStartSec}
                                setSec={setRemoveStartSec}
                                ms={removeStartMs}
                                setMs={setRemoveStartMs}
                            />
                            <TimeRow
                                label="End time"
                                sec={removeEndSec}
                                setSec={setRemoveEndSec}
                                ms={removeEndMs}
                                setMs={setRemoveEndMs}
                            />
                            <div className="mt-3">
                                <Button variant="destructive" className="w-full" onClick={submitManual}>
                                    Remove
                                </Button>
                            </div>
                        </div>

                        <div className="text-center text-xs">
                            <button
                                className="text-primary underline underline-offset-4 hover:text-primary/80"
                                onClick={() => setRemoveManual(false)}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
