import client from './client';
import { Slot } from '../app/types';

export const slotService = {
    getAllSlots: async () => {
        const response = await client.get<Slot[]>('/slots');
        return response.data;
    },

    getSlotsByShop: async (shopId: string) => {
        const response = await client.get<Slot[]>(`/slots/shop/${shopId}`);
        return response.data;
    },

    createSlot: async (slotData: any) => {
        const response = await client.post<Slot>('/slots', slotData);
        return response.data;
    },

    updateSlot: async (id: string, slotData: Partial<Slot>) => {
        const response = await client.put<Slot>(`/slots/${id}`, slotData);
        return response.data;
    },
};
