import client from './client';
import { User } from '../app/types';

export const userService = {
    getAllUsers: async () => {
        const response = await client.get<User[]>('/users');
        return response.data;
    },

    updateUser: async (id: string, userData: Partial<User>) => {
        const response = await client.put<User>(`/users/${id}`, userData);
        return response.data;
    },

    deleteUser: async (id: string) => {
        const response = await client.delete(`/users/${id}`);
        return response.data;
    },
};
