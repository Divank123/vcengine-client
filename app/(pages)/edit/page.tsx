"use client"

import { useState } from "react"
import { VideoPreview } from "./components/video-preview"
import { Timeline } from "./components/timeline"
import { ChangesDrawer } from "./components/drawer"
import { AddDialog } from "./components/dialogs/add"
import { ReplaceDialog } from "./components/dialogs/replace"
import { RemoveDialog } from "./components/dialogs/remove"
import { Button } from "@/components/ui/button"
import type { ChangeEntry } from "./components/lib/utils"
import { MainDialog } from "./components/dialogs/main"

const SAMPLE_VIDEO_URL = "http://localhost:3000/videos/sample.mp4"

export default function VideoEditorPage() {
  const duration = 120 // seconds
  const [start, setStart] = useState(10)
  const [end, setEnd] = useState(40)
  const [cursor, setCursor] = useState(10)
  const [changes, setChanges] = useState<ChangeEntry[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Dialog states
  const [openAdd, setOpenAdd] = useState(false)
  const [openReplace, setOpenReplace] = useState(false)
  const [openRemove, setOpenRemove] = useState(false)

  const [showActionDialog, setShowActionDialog] = useState(false)

  // Manual vs auto toggles
  const [addManual, setAddManual] = useState(false)
  const [replaceManual, setReplaceManual] = useState(false)
  const [removeManual, setRemoveManual] = useState(false)

  // Inputs for manual modes
  const [addSec, setAddSec] = useState(String(cursor | 0))
  const [addMs, setAddMs] = useState("0")
  const [replaceStartSec, setReplaceStartSec] = useState(String(start | 0))
  const [replaceStartMs, setReplaceStartMs] = useState("0")
  const [replaceEndSec, setReplaceEndSec] = useState(String(end | 0))
  const [replaceEndMs, setReplaceEndMs] = useState("0")
  const [removeStartSec, setRemoveStartSec] = useState(String(start | 0))
  const [removeStartMs, setRemoveStartMs] = useState("0")
  const [removeEndSec, setRemoveEndSec] = useState(String(end | 0))
  const [removeEndMs, setRemoveEndMs] = useState("0")

  // File uploads
  const [addFile, setAddFile] = useState<File | null>(null)
  const [replaceFile, setReplaceFile] = useState<File | null>(null)

  const addChange = (type: "add" | "replace" | "remove", s: number, e: number) => {
    setChanges((prev) => [...prev, { id: Math.random().toString(36).slice(2), type, start: s, end: e }])
  }

  const fromSecMs = (secStr: string, msStr: string) => {
    const s = Number.parseFloat(secStr || "0")
    const m = Number.parseFloat(msStr || "0")
    return Math.max(0, Math.min(s + m / 1000, duration))
  }

  // Add handlers
  const submitAddAuto = () => {
    const s = cursor
    const e = cursor + 2
    addChange("add", s, Math.min(e, duration))
    setOpenAdd(false)
    setAddManual(false)
    setAddFile(null)
  }

  const submitAddManual = () => {
    const s = fromSecMs(addSec, addMs)
    const e = s + 2
    addChange("add", s, Math.min(e, duration))
    setOpenAdd(false)
    setAddManual(false)
    setAddFile(null)
  }

  // Replace handlers
  const submitReplaceAuto = () => {
    addChange("replace", start, end)
    setOpenReplace(false)
    setReplaceManual(false)
    setReplaceFile(null)
  }

  const submitReplaceManual = () => {
    const s = fromSecMs(replaceStartSec, replaceStartMs)
    const e = fromSecMs(replaceEndSec, replaceEndMs)
    if (e > s) addChange("replace", s, Math.min(e, duration))
    setOpenReplace(false)
    setReplaceManual(false)
    setReplaceFile(null)
  }

  // Remove handlers
  const submitRemoveAuto = () => {
    addChange("remove", start, end)
    setOpenRemove(false)
    setRemoveManual(false)
  }

  const submitRemoveManual = () => {
    const s = fromSecMs(removeStartSec, removeStartMs)
    const e = fromSecMs(removeEndSec, removeEndMs)
    if (e > s) addChange("remove", s, Math.min(e, duration))
    setOpenRemove(false)
    setRemoveManual(false)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold">Video Editor</h1>
        <p className="text-sm text-muted-foreground">Edit your video with precision timeline controls</p>
      </div>

      <div className="flex flex-1 overflow-hidden gap-4 px-6 py-4">
        {/* Left side - Editor (flex-1 to take available space) */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Preview Section - fixed height */}
          <div className="flex-shrink-0">
            <VideoPreview duration={duration} changes={changes} videoUrl={SAMPLE_VIDEO_URL} />
          </div>

          {/* Timeline Section - flex-1 to fill remaining space */}
          <div className="flex-1 overflow-hidden">
            <Timeline
              duration={duration}
              start={start}
              setStart={setStart}
              end={end}
              setEnd={setEnd}
              cursor={cursor}
              setCursor={setCursor}
              changes={changes}
              onAddClick={() => setOpenAdd(true)}
              onReplaceClick={() => setOpenReplace(true)}
              onRemoveClick={() => setOpenRemove(true)}
            />
          </div>
        </div>

        {/* Right side - Show Changes button */}
        <div className="flex-shrink-0 w-32">
          <Button
            onClick={() => setDrawerOpen(true)}
            variant="outline"
            className="w-full"
            disabled={changes.length === 0}
          >
            Show Changes ({changes.length})
          </Button>
        </div>
      </div>


      <Button
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        onClick={() => setShowActionDialog(true)}>
        Make Change
      </Button>


      <MainDialog
        setOpenAdd={setOpenAdd}
        setOpenRemove={setOpenRemove}
        setOpenReplace={setOpenReplace}
        setShowActionDialog={setShowActionDialog}
        showActionDialog={showActionDialog}
      />


      {/* Changes Drawer */}
      <ChangesDrawer open={drawerOpen} onOpenChange={setDrawerOpen} changes={changes} />

      {/* Dialogs */}
      <AddDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        addManual={addManual}
        setAddManual={setAddManual}
        addSec={addSec}
        setAddSec={setAddSec}
        addMs={addMs}
        setAddMs={setAddMs}
        addFile={addFile}
        setAddFile={setAddFile}
        submitAuto={submitAddAuto}
        submitManual={submitAddManual}
        currentCursor={cursor}
      />

      <ReplaceDialog
        open={openReplace}
        onOpenChange={setOpenReplace}
        replaceManual={replaceManual}
        setReplaceManual={setReplaceManual}
        replaceStartSec={replaceStartSec}
        setReplaceStartSec={setReplaceStartSec}
        replaceStartMs={replaceStartMs}
        setReplaceStartMs={setReplaceStartMs}
        replaceEndSec={replaceEndSec}
        setReplaceEndSec={setReplaceEndSec}
        replaceEndMs={replaceEndMs}
        setReplaceEndMs={setReplaceEndMs}
        replaceFile={replaceFile}
        setReplaceFile={setReplaceFile}
        submitAuto={submitReplaceAuto}
        submitManual={submitReplaceManual}
        currentStart={start}
        currentEnd={end}
      />

      <RemoveDialog
        open={openRemove}
        onOpenChange={setOpenRemove}
        removeManual={removeManual}
        setRemoveManual={setRemoveManual}
        removeStartSec={removeStartSec}
        setRemoveStartSec={setRemoveStartSec}
        removeStartMs={removeStartMs}
        setRemoveStartMs={setRemoveStartMs}
        removeEndSec={removeEndSec}
        setRemoveEndSec={setRemoveEndSec}
        removeEndMs={removeEndMs}
        setRemoveEndMs={setRemoveEndMs}
        submitAuto={submitRemoveAuto}
        submitManual={submitRemoveManual}
        currentStart={start}
        currentEnd={end}
      />
    </div>
  )
}
