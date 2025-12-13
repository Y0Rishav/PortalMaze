import React, { createContext, useState, useContext, useEffect } from 'react';
import { api, setAccessToken } from '../api';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                // Try to refresh token on load
                const data = await api.refresh();
                if (data.accessToken) {
                    setAccessToken(data.accessToken);
                    const decoded = jwtDecode(data.accessToken);
                    setUser({ username: decoded.username, _id: decoded.id });
                }
            } catch (error) {
                // Not authenticated or refresh failed
                console.log("Auto-login failed", error);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = (userData) => {
        if (userData.accessToken) {
            setAccessToken(userData.accessToken);
            setUser({ username: userData.username, _id: userData.userId });
        }
    };

    const logout = async () => {
        try {
            await api.logout();
        } catch (error) {
            console.error("Logout error", error);
        }
        setAccessToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            playerName: user?.username, 
            login, 
            logout, 
            isAuthenticated: !!user,
            loading
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
