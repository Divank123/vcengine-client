"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TimeRow } from "../shared/time-row"
import { UploadBox } from "../shared/upload-box"
import { toMinutes } from "../lib/utils"

interface AddDialogProps {
    open: boolean
    onOpenChange: (v: boolean) => void
    addManual: boolean
    setAddManual: (v: boolean) => void
    addSec: string
    setAddSec: (v: string) => void
    addMs: string
    setAddMs: (v: string) => void
    addFile: File | null
    setAddFile: (f: File | null) => void
    submitAuto: () => void
    submitManual: () => void
    currentCursor: number
}

export function AddDialog(props: AddDialogProps) {
    const {
        open,
        onOpenChange,
        addManual,
        setAddManual,
        addSec,
        setAddSec,
        addMs,
        setAddMs,
        addFile,
        setAddFile,
        submitAuto,
        submitManual,
        currentCursor,
    } = props

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add section</DialogTitle>
                    <DialogDescription>Insert a new segment into the timeline.</DialogDescription>
                </DialogHeader>

                {!addManual && (
                    <div className="space-y-3">
                        <div className="rounded-lg border border-border p-3">
                            <div className="text-sm font-medium">Auto add</div>
                            <p className="text-xs text-muted-foreground">
                                Start at current cursor position: <strong>{toMinutes(currentCursor)}</strong>
                            </p>
                            <UploadBox file={addFile} setFile={setAddFile} label="Upload new section" />
                            <div className="mt-3">
                                <Button className="w-full" onClick={submitAuto}>
                                    Make Changes
                                </Button>
                            </div>
                        </div>

                        <div className="text-center text-xs">
                            <button
                                className="text-primary underline underline-offset-4 hover:text-primary/80"
                                onClick={() => setAddManual(true)}
                            >
                                Make changes manually
                            </button>
                        </div>
                    </div>
                )}

                {addManual && (
                    <div className="space-y-3">
                        <div className="rounded-lg border border-border p-3">
                            <div className="text-sm font-medium">Add with specific time</div>
                            <p className="text-xs text-muted-foreground">Provide start time in minutes and seconds.</p>
                            <TimeRow label="Start time" sec={addSec} setSec={setAddSec} ms={addMs} setMs={setAddMs} />
                            <UploadBox file={addFile} setFile={setAddFile} label="Upload new section" />
                            <div className="mt-3">
                                <Button className="w-full" onClick={submitManual}>
                                    Make Changes
                                </Button>
                            </div>
                        </div>

                        <div className="text-center text-xs">
                            <button
                                className="text-primary underline underline-offset-4 hover:text-primary/80"
                                onClick={() => setAddManual(false)}
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
