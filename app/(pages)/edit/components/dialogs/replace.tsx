"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TimeRow } from "../shared/time-row"
import { UploadBox } from "../shared/upload-box"
import { toMinutes } from "../lib/utils"

interface ReplaceDialogProps {
    open: boolean
    onOpenChange: (v: boolean) => void
    replaceManual: boolean
    setReplaceManual: (v: boolean) => void
    replaceStartSec: string
    setReplaceStartSec: (v: string) => void
    replaceStartMs: string
    setReplaceStartMs: (v: string) => void
    replaceEndSec: string
    setReplaceEndSec: (v: string) => void
    replaceEndMs: string
    setReplaceEndMs: (v: string) => void
    replaceFile: File | null
    setReplaceFile: (f: File | null) => void
    submitAuto: () => void
    submitManual: () => void
    currentStart: number
    currentEnd: number
}

export function ReplaceDialog(props: ReplaceDialogProps) {
    const {
        open,
        onOpenChange,
        replaceManual,
        setReplaceManual,
        replaceStartSec,
        setReplaceStartSec,
        replaceStartMs,
        setReplaceStartMs,
        replaceEndSec,
        setReplaceEndSec,
        replaceEndMs,
        setReplaceEndMs,
        replaceFile,
        setReplaceFile,
        submitAuto,
        submitManual,
        currentStart,
        currentEnd,
    } = props

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Replace section</DialogTitle>
                    <DialogDescription>Replace a selected segment with a new upload.</DialogDescription>
                </DialogHeader>

                {!replaceManual && (
                    <div className="space-y-3">
                        <div className="rounded-lg border border-border p-3">
                            <div className="text-sm font-medium">Auto replace</div>
                            <p className="text-xs text-muted-foreground">
                                Current selection: <strong>{toMinutes(currentStart)}</strong> → <strong>{toMinutes(currentEnd)}</strong>
                            </p>
                            <UploadBox file={replaceFile} setFile={setReplaceFile} label="Upload replacement section" />
                            <div className="mt-3">
                                <Button className="w-full" onClick={submitAuto}>
                                    Make Changes
                                </Button>
                            </div>
                        </div>

                        <div className="text-center text-xs">
                            <button
                                className="text-primary underline underline-offset-4 hover:text-primary/80"
                                onClick={() => setReplaceManual(true)}
                            >
                                Make changes manually
                            </button>
                        </div>
                    </div>
                )}

                {replaceManual && (
                    <div className="space-y-3">
                        <div className="rounded-lg border border-border p-3">
                            <div className="text-sm font-medium">Replace with specific time</div>
                            <p className="text-xs text-muted-foreground">Provide start and end time in minutes and seconds.</p>
                            <TimeRow
                                label="Start time"
                                sec={replaceStartSec}
                                setSec={setReplaceStartSec}
                                ms={replaceStartMs}
                                setMs={setReplaceStartMs}
                            />
                            <TimeRow
                                label="End time"
                                sec={replaceEndSec}
                                setSec={setReplaceEndSec}
                                ms={replaceEndMs}
                                setMs={setReplaceEndMs}
                            />
                            <UploadBox file={replaceFile} setFile={setReplaceFile} label="Upload replacement section" />
                            <div className="mt-3">
                                <Button className="w-full" onClick={submitManual}>
                                    Make Changes
                                </Button>
                            </div>
                        </div>

                        <div className="text-center text-xs">
                            <button
                                className="text-primary underline underline-offset-4 hover:text-primary/80"
                                onClick={() => setReplaceManual(false)}
                            >
                                Back to auto
                            </button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
