import client from './client';
import { Shop } from '../app/types';

export const shopService = {
    getAllShops: async () => {
        const response = await client.get<Shop[]>('/shops');
        return response.data;
    },

    getShopById: async (id: string) => {
        const response = await client.get<Shop>(`/shops/${id}`);
        return response.data;
    },

    getShopByShopkeeper: async (userId: string) => {
        const response = await client.get<Shop>(`/shops/by-shopkeeper/${userId}`);
        return response.data;
    },

    createShop: async (shopData: any) => {
        const response = await client.post<Shop>('/shops', shopData);
        return response.data;
    },

    updateShop: async (id: string, shopData: Partial<Shop>) => {
        const response = await client.put<Shop>(`/shops/${id}`, shopData);
        return response.data;
    },
};
