import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, logout as apiLogout, getCurrentUser } from '../services/api'; // Import your API functions

// Define types for the user and context
interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, remember: boolean) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
    setUser: React.Dispatch<React.SetStateAction<any>>;
}

interface AuthProviderProps {
    children: ReactNode;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Function to get the logged-in user
    const fetchUser = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Call fetchUser when the component mounts
    useEffect(() => {
        fetchUser();
    }, []);

    // Function to handle login
    const login = async (email: string, password: string, remember: boolean) => {
        try {
            await loginUser(email, password, remember);
            await fetchUser();
        } catch (error: unknown) {
            throw new Error((error as Error).message);
        }
    };


    const logout = async () => {
        await apiLogout();
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        loading,
        setUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};