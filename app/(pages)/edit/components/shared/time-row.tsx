"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface TimeRowProps {
    label: string
    sec: string
    setSec: (v: string) => void
    ms: string
    setMs: (v: string) => void
}

export function TimeRow({ label, sec, setSec, ms, setMs }: TimeRowProps) {
    return (
        <div className="mt-3 grid grid-cols-3 items-end gap-3">
            <div className="col-span-3">
                <Label className="text-xs">{label}</Label>
            </div>
            <div className="col-span-2">
                <Label htmlFor={`${label}-sec`} className="sr-only">
                    Minutes
                </Label>
                <div className="mb-1 text-xs text-muted-foreground">Minutes</div>
                <Input
                    id={`${label}-sec`}
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={sec}
                    onChange={(e) => setSec(e.target.value)}
                    className="bg-background/70"
                />
            </div>
            <div className="col-span-1">
                <Label htmlFor={`${label}-ms`} className="sr-only">
                    Seconds
                </Label>
                <div className="mb-1 text-xs text-muted-foreground">Sec</div>
                <Input
                    id={`${label}-ms`}
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={ms}
                    onChange={(e) => setMs(e.target.value)}
                    className="bg-background/70"
                />
            </div>
        </div>
    )
}
