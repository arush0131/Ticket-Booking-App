import axios from 'axios';
import { User, Transport, Booking, LoginFormData, RegisterFormData, BookingFormData } from '../types';

const API_URL = 'https://ticket-booking-app-backend-clm5.onrender.com';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized error (e.g., redirect to login)
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (data: LoginFormData) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
    register: async (data: RegisterFormData) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};

export const transportService = {
    getTransports: async (type?: 'train' | 'flight' | 'bus') => {
        const response = await api.get('/transport/transports', { params: { type } });
        return response.data;
    },
    getAdminTransports: async (type?: 'train' | 'flight' | 'bus') => {
        const response = await api.get('/admin/transport', { params: { type } });
        return response.data;
    },
    addTransport: async (data: Omit<Transport, 'id' | 'availableSeats'>) => {
        const response = await api.post('/admin/transport', data);
        return response.data;
    },
    updateTransport: async (id: string, data: Partial<Transport>) => {
        const response = await api.put(`/admin/transport/${id}`, data);
        return response.data;
    },
    deleteTransport: async (id: string) => {
        const response = await api.delete(`/admin/transport/${id}`);
        return response.data;
    }
};

export const bookingService = {
    createBooking: async (data: BookingFormData) => {
        const response = await api.post('/bookings', data);
        return response.data;
    },
    getBookings: async () => {
        const response = await api.get('/bookings/my-bookings');
        return response.data;
    },
    cancelBooking: async (id: string) => {
        const response = await api.post(`/bookings/${id}/cancel`);
        return response.data;
    }
};

export const adminService = {
    getAllBookings: async () => {
        const response = await api.get('/admin/bookings');
        return response.data;
    },
    getAllTickets: async () => {
        const response = await api.get('/admin/tickets');
        return response.data;
    },
    addTicket: async (data: { name: string; price: number; description?: string; available: number; }) => {
        const response = await api.post('/admin/tickets', data);
        return response.data;
    },
    updateTicket: async (id: string, data: Partial<{ name: string; price: number; description?: string; available: number; }>) => {
        const response = await api.put(`/admin/tickets/${id}`, data);
        return response.data;
    },
    deleteTicket: async (id: string) => {
        const response = await api.delete(`/admin/tickets/${id}`);
        return response.data;
    }
}; 
