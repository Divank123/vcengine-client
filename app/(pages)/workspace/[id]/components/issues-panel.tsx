"use client"

import { useState } from "react"
import useSWR from "swr"
// import { fetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUpRight, ImagePlus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type Issue = {
  id: string
  title: string
  description: string
  author: string
  createdAt: string
  comments: Array<{ id: string; author: string; text: string; createdAt: string }>
}

export default function IssuesPanel({ workspaceId }: { workspaceId: string }) {
  const { data, mutate } = useSWR<Issue[]>(`/api/workspace/${workspaceId}/issues`, fetcher)
  const [view, setView] = useState<"list" | "detail" | "new">("list")
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null)

  if (!data) {
    return <div className="rounded-xl border border-border/80 bg-card/40 p-6">Loading issues…</div>
  }

  if (view === "detail" && activeIssue) {
    return (
      <IssueDetail
        issue={activeIssue}
        onBack={() => setView("list")}
        workspaceId={workspaceId}
        refresh={() => mutate()}
      />
    )
  }

  if (view === "new") {
    return (
      <NewIssue
        workspaceId={workspaceId}
        onCancel={() => setView("list")}
        onCreated={() => {
          mutate()
          setView("list")
        }}
      />
    )
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Issues</h3>
        <Button
          onClick={() => setView("new")}
          variant="outline"
          className="border-border bg-card/60 hover:bg-card/80 hover:border-primary/50"
        >
          New issue
        </Button>
      </div>
      <div className="divide-y divide-border/60">
        {data.map((issue) => (
          <button
            key={issue.id}
            onClick={() => {
              setActiveIssue(issue)
              setView("detail")
            }}
            className="w-full text-left py-3 hover:bg-card/60 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{issue.title}</div>
              <div className="text-xs text-muted-foreground">
                {issue.author} • {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
              </div>
            </div>
            <div className="text-sm text-muted-foreground line-clamp-1">{issue.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function IssueDetail({
  issue,
  onBack,
  workspaceId,
  refresh,
}: {
  issue: Issue
  onBack: () => void
  workspaceId: string
  refresh: () => void
}) {
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!comment.trim()) return
    setLoading(true)
    await fetch(`/api/workspace/${workspaceId}/issues/${issue.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: comment }),
    })
    setComment("")
    setLoading(false)
    refresh()
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card/40 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{issue.title}</h3>
        <Button variant="outline" onClick={onBack} className="border-border bg-transparent">
          Back
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">{issue.description}</p>
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">Comments</div>
        <div className="space-y-2">
          {issue.comments.map((c) => (
            <div key={c.id} className="rounded-md border border-border/80 p-2">
              <div className="text-xs text-muted-foreground">
                {c.author} • {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
              </div>
              <div className="text-sm">{c.text}</div>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-2 pt-2">
          <Textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-20"
          />
          <Button onClick={submit} disabled={loading} className="group h-10">
            <span className="mr-1">Send</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function NewIssue({
  workspaceId,
  onCancel,
  onCreated,
}: {
  workspaceId: string
  onCancel: () => void
  onCreated: () => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!title.trim()) return
    setLoading(true)
    await fetch(`/api/workspace/${workspaceId}/issues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    })
    setLoading(false)
    onCreated()
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card/40 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">New Issue</h3>
        <Button variant="outline" onClick={onCancel} className="border-border bg-transparent">
          Cancel
        </Button>
      </div>
      <div className="space-y-3">
        <Input
          placeholder="Issue title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-input border-border focus:border-primary"
        />
        <Textarea
          placeholder="Describe the problem..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-36 bg-input border-border focus:border-primary"
        />

        <label className="group inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border/80 bg-card/60 hover:border-primary/50 hover:bg-card/80 cursor-pointer transition-colors w-fit">
          <ImagePlus className="w-4 h-4 text-primary" />
          <span className="text-sm">Upload image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="sr-only"
          />
        </label>

        <div>
          <Button onClick={submit} disabled={loading} className="group">
            <span className="mr-1">Create</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  )
}
