import client from './client';
import { User } from '../app/types';

export const authService = {
    login: async (email: string, password: string) => {
        const response = await client.post('/auth/login', { email, password });
        if (response.data) {
            localStorage.setItem('pds_current_user', JSON.stringify(response.data));
        }
        return response.data;
    },

    register: async (userData: any) => {
        const response = await client.post('/auth/register', userData);
        if (response.data) {
            localStorage.setItem('pds_current_user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('pds_current_user');
    },

    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem('pds_current_user');
        return userStr ? JSON.parse(userStr) : null;
    },
};
