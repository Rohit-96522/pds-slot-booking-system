import client from './client';
import { Booking } from '../app/types';

export const bookingService = {
    getAllBookings: async () => {
        const response = await client.get<Booking[]>('/bookings');
        return response.data;
    },

    getBookingsByUser: async (userId: string) => {
        const response = await client.get<Booking[]>(`/bookings/user/${userId}`);
        return response.data;
    },

    getBookingsByShop: async (shopId: string) => {
        const response = await client.get<Booking[]>(`/bookings/shop/${shopId}`);
        return response.data;
    },

    createBooking: async (bookingData: any) => {
        const response = await client.post<Booking>('/bookings', bookingData);
        return response.data;
    },
};
