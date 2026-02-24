export type UserRole = 'admin' | 'shopkeeper' | 'beneficiary';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  cardNumber?: string; // For beneficiaries (ration card)
  familyMembers?: number; // For beneficiaries
  shopId?: string; // For shopkeepers
  createdAt: string;
}

export interface Shop {
  id: string;
  name: string;
  address: string;
  image?: string;
  shopkeeperId: string;
  status: 'pending' | 'approved' | 'rejected';
  totalStock: number;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export interface Stock {
  rice: number;
  wheat: number;
  sugar: number;
  kerosene: number;
}

export interface Slot {
  id: string;
  shopId: string;
  date: string;
  timeSlot: string; // e.g., "09:00 - 11:00"
  maxCapacity: number;
  bookedCount: number;
  stockLimit: Stock;
  availableStock: Stock;
}

export interface Booking {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  shopId: string;
  shopName: string;
  slotId: string;
  date: string;
  timeSlot: string;
  entitlement: Stock;
  status: 'confirmed' | 'completed' | 'cancelled';
  qrCode: string;
  createdAt: string;
}

export interface StockAllocation {
  shopId: string;
  stock: Stock;
  allocatedBy: string;
  allocatedAt: string;
}
