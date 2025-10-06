"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LogIn, UserPlus, Video, Users } from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <Video className="h-8 w-8 text-emerald-400" />
                            <span className="text-xl font-bold text-white">VC Engine</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/login">
                                <Button variant="ghost" className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700">
                                    <LogIn className="h-4 w-4" />
                                    <span>Sign In</span>
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                                    <UserPlus className="h-4 w-4" />
                                    <span>Sign Up</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Welcome to{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                            VC Engine
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        The ultimate platform for video conferencing and collaboration.
                        Connect, communicate, and collaborate with your team like never before.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link href="/signup">
                            <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white">
                                Get Started Free
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-16">
                    <Card className="text-center bg-gray-800/50 backdrop-blur-sm border-gray-700">
                        <CardHeader>
                            <div className="mx-auto w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                                <Video className="h-6 w-6 text-emerald-400" />
                            </div>
                            <CardTitle className="text-white">HD Video Calls</CardTitle>
                            <CardDescription className="text-gray-300">
                                Crystal clear video quality for seamless communication
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="text-center bg-gray-800/50 backdrop-blur-sm border-gray-700">
                        <CardHeader>
                            <div className="mx-auto w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-emerald-400" />
                            </div>
                            <CardTitle className="text-white">Team Collaboration</CardTitle>
                            <CardDescription className="text-gray-300">
                                Work together with your team in real-time
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="text-center bg-gray-800/50 backdrop-blur-sm border-gray-700">
                        <CardHeader>
                            <div className="mx-auto w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                                <UserPlus className="h-6 w-6 text-emerald-400" />
                            </div>
                            <CardTitle className="text-white">Easy Setup</CardTitle>
                            <CardDescription className="text-gray-300">
                                Get started in minutes with our intuitive interface
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-gray-300">
                        <p>&copy; 2024 VC Engine. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
