export interface User {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
}

export interface Transport {
    id: string;
    type: 'train' | 'flight' | 'bus';
    name: string;
    from: string;
    to: string;
    price: number;
    seats: number;
    availableSeats: number;
    departureTime?: string;
    arrivalTime?: string;
}

export interface Booking {
    id: string;
    userId: string;
    transportId: string;
    type: 'train' | 'flight' | 'bus' | 'Unknown';
    date: string;
    passengers: number;
    status: 'confirmed' | 'cancelled';
    createdAt: string;
    route?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface BookingFormData {
    transportId: string;
    passengers: number;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
} 