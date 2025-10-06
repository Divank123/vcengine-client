"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
    id: string;
    title?: string;
    description?: string;
    type?: "success" | "error" | "warning" | "info";
    duration?: number;
    onClose?: () => void;
}

interface ToastComponentProps extends ToastProps {
    onRemove: (id: string) => void;
}

const ToastComponent = ({
    id,
    title,
    description,
    type = "info",
    duration = 5000,
    onRemove
}: ToastComponentProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation
        const timer = setTimeout(() => setIsVisible(true), 100);

        // Auto remove after duration
        const removeTimer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onRemove(id), 300);
        }, duration);

        return () => {
            clearTimeout(timer);
            clearTimeout(removeTimer);
        };
    }, [id, duration, onRemove]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onRemove(id), 300);
    };

    const icons = {
        success: <CheckCircle className="h-5 w-5 text-green-400" />,
        error: <AlertCircle className="h-5 w-5 text-red-400" />,
        warning: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
        info: <Info className="h-5 w-5 text-blue-400" />,
    };

    const bgColors = {
        success: "bg-green-900/90 border-green-700",
        error: "bg-red-900/90 border-red-700",
        warning: "bg-yellow-900/90 border-yellow-700",
        info: "bg-blue-900/90 border-blue-700",
    };

    return (
        <div
            className={cn(
                "transform transition-all duration-300 ease-in-out",
                isVisible
                    ? "translate-x-0 opacity-100 scale-100"
                    : "translate-x-full opacity-0 scale-95"
            )}
        >
            <div
                className={cn(
                    "flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg max-w-sm",
                    bgColors[type]
                )}
            >
                {icons[type]}
                <div className="flex-1 min-w-0">
                    {title && (
                        <p className="text-sm font-medium text-white mb-1">{title}</p>
                    )}
                    {description && (
                        <p className="text-sm text-gray-300">{description}</p>
                    )}
                </div>
                <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

// Toast Container
export const ToastContainer = ({ toasts, onRemove }: { toasts: ToastProps[], onRemove: (id: string) => void }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <ToastComponent
                    key={toast.id}
                    {...toast}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
};

// Toast Hook
export const useToast = () => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const addToast = (toast: Omit<ToastProps, "id">) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { ...toast, id }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const toast = {
        success: (title: string, description?: string) =>
            addToast({ title, description, type: "success" }),
        error: (title: string, description?: string) =>
            addToast({ title, description, type: "error" }),
        warning: (title: string, description?: string) =>
            addToast({ title, description, type: "warning" }),
        info: (title: string, description?: string) =>
            addToast({ title, description, type: "info" }),
    };

    return { toast, toasts, removeToast };
};
