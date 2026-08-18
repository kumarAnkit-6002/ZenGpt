import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/auth`;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true); // true while we check for an existing session

    // On first load, ask the backend if the httpOnly cookie still
    // corresponds to a valid session, so refreshing the page keeps you logged in.
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch(`${API_BASE}/me`, {
                    credentials: "include"
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.log("Session check failed:", err);
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        };

        checkSession();
    }, []);

    const register = async (name, username, password) => {
        const response = await fetch(`${API_BASE}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, username, password })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Registration failed");
        }

        setUser(data.user);
        return data.user;
    };

    const login = async (username, password) => {
        const response = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Login failed");
        }

        setUser(data.user);
        return data.user;
    };

    const logout = async () => {
        try {
            await fetch(`${API_BASE}/logout`, {
                method: "POST",
                credentials: "include"
            });
        } catch (err) {
            console.log("Logout request failed:", err);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, authLoading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
