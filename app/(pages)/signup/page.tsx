"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { UploadDialog } from "@/components/ui/upload-dialog";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, UserCircle, Camera, X } from "lucide-react";
import axios from "axios";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        name: "",
        password: "",
        confirmPassword: "",
    });
    const [avatar, setAvatar] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<'uploading' | 'success' | 'error'>('uploading');
    const [uploadErrorMessage, setUploadErrorMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast, toasts, removeToast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Invalid File", "Please select an image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File Too Large", "File size must be less than 5MB");
                return;
            }

            // Store selected file and show preview
            setSelectedFile(file);

            // Create preview URL for immediate display
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setAvatar(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadComplete = (uploadedUrl: string) => {
        setAvatar(uploadedUrl);
        setShowUploadDialog(false);
        setSelectedFile(null);
        toast.success("Success", "Profile picture uploaded successfully!");
    };

    const handleUploadError = (error: string) => {
        setShowUploadDialog(false);
        setSelectedFile(null);
        toast.error("Upload Failed", error);
    };

    const handleUploadDialogClose = () => {
        setShowUploadDialog(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.error("Error", "Please fill in all fields");
            return;
        }

        if (!formData.email.includes("@")) {
            toast.error("Error", "Please enter a valid email address");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Error", "Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Error", "Password must be at least 6 characters long");
            return;
        }

        if (formData.username.length < 3) {
            toast.error("Error", "Username must be at least 3 characters long");
            return;
        }

        setIsLoading(true);

        try {
            let avatarUrl = null;

            // Upload avatar if file is selected
            if (selectedFile) {
                console.log("Uploading avatar...");
                avatarUrl = await uploadAvatar(selectedFile);
            }

            // TODO: Implement actual signup logic with avatar URL
            console.log("Signup data:", { ...formData, avatar: avatarUrl });

            await axios.post("http://localhost:1234/api/v1/auth/signup", {
                email: formData.email,
                username: formData.username,
                password: formData.confirmPassword,
                name: formData.name,
                avatar: avatarUrl
            })


            setIsLoading(false);
            setShowUploadDialog(false);
            toast.success("Success", "Account created successfully! Welcome to VC Engine!");

        } catch (error) {
            setIsLoading(false);
            setShowUploadDialog(false);
            toast.error("Upload Failed", "Failed to upload avatar. Please try again.");
        }
    };

    const uploadAvatar = async (file: File): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            // Reset upload states
            setUploadProgress(0);
            setUploadStatus('uploading');
            setUploadErrorMessage('');
            setShowUploadDialog(true);

            try {
                const {
                    data: {
                        result: { uploadUrl, avatarKey },
                    },
                } = await axios.post(
                    `http://localhost:1234/api/v1/auth/upload-avatar`,
                    {
                        contentType: selectedFile?.type
                    }
                );


                const { data } = await axios.put(uploadUrl, selectedFile, {
                    headers: {
                        "Content-Type": selectedFile?.type,
                    },
                    onUploadProgress: ({ progress }) => {
                        if (progress) {
                            const percent = Math.round(progress * 100);
                            setUploadProgress(percent);
                        }
                    },
                });

                resolve(avatarKey)
            }
            catch (error) {
                reject()
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            <UploadDialog
                isOpen={showUploadDialog}
                onClose={handleUploadDialogClose}
                file={selectedFile}
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                progress={uploadProgress}
                status={uploadStatus}
                errorMessage={uploadErrorMessage}
            />
            <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-2xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-white">Create account</CardTitle>
                    <CardDescription className="text-center text-gray-300">
                        Sign up to get started with your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center space-y-2">
                            <Label className="text-sm font-medium text-gray-200">Profile Picture</Label>
                            <div className="relative">
                                <Avatar className="h-20 w-20 cursor-pointer hover:opacity-80 transition-opacity border-2 border-emerald-500/30" onClick={handleAvatarClick}>
                                    {avatar ? (
                                        <AvatarImage src={avatar} alt="Profile" className="object-cover" />
                                    ) : (
                                        <AvatarFallback className="bg-gray-700 text-emerald-400 border-2 border-emerald-500/30">
                                            <UserCircle className="h-8 w-8" />
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                {avatar && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeAvatar();
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                                <div className="absolute bottom-0 right-0 bg-emerald-500 text-white rounded-full p-1 cursor-pointer hover:bg-emerald-600 transition-colors">
                                    <Camera className="h-3 w-3" />
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 text-center">
                                Click to upload a profile picture
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-200">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-emerald-400" />
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-gray-200">Username</Label>
                            <div className="relative">
                                <UserCircle className="absolute left-3 top-3 h-4 w-4 text-emerald-400" />
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-200">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-emerald-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-200">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-emerald-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-emerald-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-gray-200">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-emerald-400" />
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-emerald-400 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>


                        <Button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? (selectedFile ? "Uploading avatar & creating account..." : "Creating account...") : "Create account"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-300">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
