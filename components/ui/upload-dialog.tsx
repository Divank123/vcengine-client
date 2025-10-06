"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Upload, AlertCircle } from "lucide-react";

interface UploadDialogProps {
    isOpen: boolean;
    onClose: () => void;
    file: File | null;
    onUploadComplete: (uploadedUrl: string) => void;
    onUploadError: (error: string) => void;
    progress?: number;
    status?: 'uploading' | 'success' | 'error';
    errorMessage?: string;
}

export function UploadDialog({
    isOpen,
    onClose,
    file,
    onUploadComplete,
    onUploadError,
    progress: externalProgress = 0,
    status: externalStatus = 'uploading',
    errorMessage: externalErrorMessage = ''
}: UploadDialogProps) {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<'uploading' | 'success' | 'error'>('uploading');
    const [errorMessage, setErrorMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Use external progress and status if provided, otherwise use internal state
    const currentProgress = externalProgress > 0 ? externalProgress : progress;
    const currentStatus = externalStatus !== 'uploading' ? externalStatus : status;
    const currentErrorMessage = externalErrorMessage || errorMessage;

    // Reset state when dialog opens
    useEffect(() => {
        if (isOpen && file) {
            setProgress(0);
            setStatus('uploading');
            setErrorMessage('');
            setIsUploading(false);
        }
    }, [isOpen, file]);

    const handleStartUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setProgress(0);
        setStatus('uploading');
        setErrorMessage('');

        try {
            // Step 1: Get signed URL from backend
            console.log('Requesting signed URL for:', file.name);

            const response = await fetch('/api/upload/signed-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get signed URL');
            }

            const { signedUrl } = await response.json();
            console.log('Got signed URL:', signedUrl);

            // Step 2: Upload to S3 using signed URL
            console.log('Uploading to S3...');

            // Create XMLHttpRequest for progress tracking
            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    setProgress(percentComplete);
                }
            });

            // Handle upload completion
            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    setProgress(100);
                    setStatus('success');
                    setIsUploading(false);
                    // Extract the final URL from the signed URL (remove query parameters)
                    const finalUrl = signedUrl.split('?')[0];
                    onUploadComplete(finalUrl);
                } else {
                    throw new Error('Upload failed');
                }
            });

            // Handle upload error
            xhr.addEventListener('error', () => {
                throw new Error('Upload failed');
            });

            // Start the upload
            xhr.open('PUT', signedUrl);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.send(file);

        } catch (error) {
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Upload failed. Please try again.');
            setIsUploading(false);
            onUploadError(error instanceof Error ? error.message : 'Upload failed. Please try again.');
        }
    };

    const handleClose = () => {
        if (status === 'uploading') return; // Prevent closing during upload
        onClose();
    };

    const getStatusIcon = () => {
        switch (currentStatus) {
            case 'uploading':
                return <Upload className="h-8 w-8 text-emerald-400 animate-pulse" />;
            case 'success':
                return <CheckCircle className="h-8 w-8 text-green-400" />;
            case 'error':
                return <XCircle className="h-8 w-8 text-red-400" />;
            default:
                return <Upload className="h-8 w-8 text-emerald-400" />;
        }
    };

    const getStatusText = () => {
        switch (currentStatus) {
            case 'uploading':
                return 'Uploading your avatar...';
            case 'success':
                return 'Avatar uploaded successfully!';
            case 'error':
                return 'Upload failed';
            default:
                return 'Ready to upload';
        }
    };

    const getStatusDescription = () => {
        switch (currentStatus) {
            case 'uploading':
                return 'Please wait while we upload your profile picture to our secure servers.';
            case 'success':
                return 'Your profile picture has been uploaded and is ready to use.';
            case 'error':
                return currentErrorMessage || 'Something went wrong during the upload process.';
            default:
                return 'Click "Start Upload" to begin uploading your profile picture.';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-3">
                        {getStatusIcon()}
                        {getStatusText()}
                    </DialogTitle>
                    <DialogDescription className="text-gray-300">
                        {getStatusDescription()}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* File Info */}
                    {file && (
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                    <Upload className="h-6 w-6 text-emerald-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Progress Bar */}
                    {currentStatus === 'uploading' && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Upload Progress</span>
                                <span className="text-emerald-400 font-medium">
                                    {Math.round(currentProgress)}%
                                </span>
                            </div>
                            <Progress
                                value={currentProgress}
                                className="h-2 bg-gray-700"
                            />
                        </div>
                    )}

                    {/* Success State */}
                    {currentStatus === 'success' && (
                        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Upload Complete</span>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {currentStatus === 'error' && (
                        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-red-400">
                                <AlertCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Upload Failed</span>
                            </div>
                            {currentErrorMessage && (
                                <p className="text-sm text-red-300 mt-2">{currentErrorMessage}</p>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {currentStatus === 'uploading' ? (
                            <Button
                                disabled
                                className="flex-1 bg-gray-600 text-gray-400 cursor-not-allowed"
                            >
                                Uploading...
                            </Button>
                        ) : currentStatus === 'success' ? (
                            <Button
                                onClick={handleClose}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                Continue
                            </Button>
                        ) : currentStatus === 'error' ? (
                            <>
                                <Button
                                    onClick={handleStartUpload}
                                    variant="outline"
                                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                    Try Again
                                </Button>
                                <Button
                                    onClick={handleClose}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={handleStartUpload}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    Start Upload
                                </Button>
                                <Button
                                    onClick={handleClose}
                                    variant="outline"
                                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                    Cancel
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
