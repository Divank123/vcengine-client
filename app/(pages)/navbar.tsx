"use client"

import { useEffect, useState } from "react"
import { Search, Bell, LogOut, Star, FolderOpen, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { requestHandler } from "@/lib/requestHandler"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { applyToast } from "@/lib/toast"

export function MainNavbar() {
    const router = useRouter()
    const { user, setUser } = useUser()
    const [searchFocused, setSearchFocused] = useState(false)
    useEffect(() => {
        requestHandler({
            url: '/auth/me',
            method: "GET",
            action: ({ user }: any) => { console.log(user); setUser(user) }
        })
    }, [])
    return (
        <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="flex items-center justify-between px-6 py-3">
                {/* Logo */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 group cursor-pointer">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:animate-glow transition-all duration-300">
                            <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
                        </div>
                        <span className="font-semibold text-lg group-hover:text-primary transition-colors">V' DURA</span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-md mx-8">
                    <div className={`relative transition-all duration-300 ${searchFocused ? "scale-105" : ""}`}>
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search repositories, workspaces..."
                            className="pl-10 bg-secondary/50 border-border hover:border-primary/50 focus:border-primary transition-all duration-300"
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                    </div>
                </div>

                {/* Profile Section */}
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="hover:bg-accent hover:scale-105 transition-all duration-200">
                        <Bell className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all duration-300"
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={`http://localhost:1234/api/v1/storage/images/avatar/${user?.avatar}`} alt="Profile" />
                                    <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 animate-scale-in" align="end">
                            <div className="flex items-center space-x-3 p-3 border-b border-border">
                                <Avatar className="h-12 w-12" onClick={() => router.push('/dashboard')}>
                                    <AvatarImage src={`http://localhost:1234/api/v1/storage/images/avatar/${user?.avatar}`} alt="Profile" />
                                    <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{user?.username}</p>
                                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                                </div>
                            </div>
                            <DropdownMenuItem className="hover:bg-accent transition-colors">
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Overview
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-accent transition-colors">
                                <FolderOpen className="mr-2 h-4 w-4" />
                                Repositories
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-accent transition-colors">
                                <Star className="mr-2 h-4 w-4" />
                                Stars
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="hover:bg-destructive/10 text-destructive transition-colors" onClick={() => {
                                requestHandler({
                                    url: "/auth/logout",
                                    method: "GET",
                                    action: () => {
                                        applyToast("Success", "Logged Out!!")
                                        router.push('/login')
                                    }
                                })
                            }}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    )
}
