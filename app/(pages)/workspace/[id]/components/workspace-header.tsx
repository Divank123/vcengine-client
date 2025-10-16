"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Star, GitFork, Download, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"

export default function WorkspaceHeader({
  workspaceName,
  onStar,
  onFork,
  onDownload,
}: {
  workspaceName: string
  onStar: () => void
  onFork: () => void
  onDownload: () => void
}) {
  const { user } = useUser()
  const router = useRouter()
  return (
    <header >
      {/* secondary line */}
      <div className="mt-4 flex items-center justify-between border-b border-border/80 pb-4">
        <div className="pl-1">
          <h2 className="text-xl md:text-2xl font-semibold">
            {user?.name} / <span className="text-primary">{workspaceName}</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <ActionButton onClick={onStar} icon={<Star className="w-4 h-4" />} label="Star" />
          <ActionButton onClick={onFork} icon={<GitFork className="w-4 h-4" />} label="Fork" />
          <ActionButton onClick={onDownload} icon={<Download className="w-4 h-4" />} label="Download" />
        </div>
      </div>
    </header>
  )
}

function ActionButton({
  onClick,
  icon,
  label,
}: {
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="group relative overflow-hidden border-border bg-card/40 hover:bg-card/80 hover:border-primary/50 transition-all"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--silver)]/10 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </span>
    </Button>
  )
}
