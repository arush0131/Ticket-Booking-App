import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginFormData, RegisterFormData } from '../types';
import { authService } from '../services/api';

interface AuthContextType extends AuthState {
    login: (data: LoginFormData) => Promise<void>;
    register: (data: RegisterFormData) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: true,
        error: null,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            setState({
                user: JSON.parse(user),
                token,
                isAuthenticated: true,
                loading: false,
                error: null,
            });
        } else {
            setState(prev => ({ ...prev, loading: false }));
        }
    }, []);

    const login = async (data: LoginFormData) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await authService.login(data);
            
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            
            setState({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                loading: false,
                error: null,
            });
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error.response?.data?.message || 'Login failed',
            }));
            throw error;
        }
    };

    const register = async (data: RegisterFormData) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await authService.register(data);
            
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            
            setState({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                loading: false,
                error: null,
            });
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error.response?.data?.message || 'Registration failed',
            }));
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setState({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
        });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 