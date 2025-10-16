"use client"

import { useRef } from "react"
import { Label } from "@/components/ui/label"
import { UploadIcon } from "lucide-react"
// import { UploadIcon } from "@/components/video-editor/icons"

interface UploadBoxProps {
    file: File | null
    setFile: (f: File | null) => void
    label: string
}

export function UploadBox({ file, setFile, label }: UploadBoxProps) {
    const inputRef = useRef<HTMLInputElement | null>(null)

    return (
        <div className="mt-3">
            <Label className="text-xs">{label}</Label>
            <div
                className="mt-1 grid place-items-center rounded-lg border border-dashed border-border bg-background/70 px-4 py-6 text-center transition-all hover:border-primary hover:bg-accent/40"
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
                }}
            >
                <input ref={inputRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                <div className="flex flex-col items-center">
                    <UploadIcon className="mb-2 h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{file ? file.name : "Click to upload or drop a file"}</span>
                </div>
            </div>
        </div>
    )
}
