export type ChangeType = "add" | "replace" | "remove"

export type ChangeEntry = {
    id: string
    type: ChangeType
    start: number // seconds
    end: number // seconds
}

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

export const toMinutes = (sec: number) => {
    const minutes = Math.floor(sec / 60)
    const seconds = Math.floor(sec % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export const toMs = (sec: number) => Math.max(0, Math.round(sec * 1000))
