"use client"

import React, { createContext, useContext, useMemo, useState } from "react";

export type AppUser = {
    id: string;
    name?: string | null;
    username?: string | null;
} | null;

export type UserContextValue = {
    user: AppUser;
    setUser: (user: AppUser) => void;
    clearUser: () => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AppUser>(null);

    const value = useMemo<UserContextValue>(() => ({
        user,
        setUser,
        clearUser: () => setUser(null),
    }), [user]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return ctx;
}
