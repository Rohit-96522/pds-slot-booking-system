import { User, Shop, Slot, Booking } from '../types';

// Local storage keys
const KEYS = {
  CURRENT_USER: 'pds_current_user',
  USERS: 'pds_users',
  SHOPS: 'pds_shops',
  SLOTS: 'pds_slots',
  BOOKINGS: 'pds_bookings',
};

// Initialize with mock data
export const initializeData = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    const mockUsers: User[] = [
      {
        id: 'admin1',
        name: 'Admin User',
        email: 'admin@pds.gov.in',
        phone: '9876543210',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'shop1',
        name: 'Rajesh Kumar',
        email: 'rajesh@shop.com',
        phone: '9876543211',
        role: 'shopkeeper',
        shopId: 'shop1',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user1',
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '9876543212',
        role: 'beneficiary',
        cardNumber: 'RC123456789',
        familyMembers: 4,
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(KEYS.USERS, JSON.stringify(mockUsers));

    const mockShops: Shop[] = [
      {
        id: 'shop1',
        name: 'Gandhi Nagar Fair Price Shop',
        address: 'Shop No. 12, Gandhi Nagar, Sector 15, Delhi - 110001',
        image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400',
        shopkeeperId: 'shop1',
        status: 'approved',
        totalStock: 5000,
        location: { lat: 28.6139, lng: 77.209 },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'shop2',
        name: 'Nehru Market Ration Store',
        address: 'Block A, Nehru Market, Connaught Place, Delhi - 110002',
        image: 'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=400',
        shopkeeperId: 'shop2',
        status: 'approved',
        totalStock: 3500,
        location: { lat: 28.6328, lng: 77.2197 },
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(KEYS.SHOPS, JSON.stringify(mockShops));

    const mockSlots: Slot[] = [
      {
        id: 'slot1',
        shopId: 'shop1',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '09:00 - 11:00',
        maxCapacity: 20,
        bookedCount: 5,
        stockLimit: { rice: 500, wheat: 400, sugar: 100, kerosene: 50 },
        availableStock: { rice: 450, wheat: 370, sugar: 90, kerosene: 45 },
      },
      {
        id: 'slot2',
        shopId: 'shop1',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '11:00 - 13:00',
        maxCapacity: 20,
        bookedCount: 8,
        stockLimit: { rice: 500, wheat: 400, sugar: 100, kerosene: 50 },
        availableStock: { rice: 460, wheat: 360, sugar: 88, kerosene: 42 },
      },
    ];
    localStorage.setItem(KEYS.SLOTS, JSON.stringify(mockSlots));

    // Create a sample booking for testing
    const mockBookings = [
      {
        id: 'BKG1234567890',
        beneficiaryId: 'user1',
        beneficiaryName: 'Priya Sharma',
        shopId: 'shop1',
        shopName: 'Gandhi Nagar Fair Price Shop',
        slotId: 'slot1',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '09:00 - 11:00',
        entitlement: { rice: 20, wheat: 12, sugar: 4, kerosene: 2 },
        status: 'confirmed' as const,
        qrCode: 'BKG-1234567890-user1',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(mockBookings));
  }
};

// Auth functions
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
};

export const login = (email: string, password: string): User | null => {
  const users: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  // In real app, verify password. For demo, just check email
  const user = users.find((u) => u.email === email);
  if (user) {
    setCurrentUser(user);
    return user;
  }
  return null;
};

export const logout = () => {
  setCurrentUser(null);
};

export const register = (userData: Omit<User, 'id' | 'createdAt'>): User => {
  const users: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  const newUser: User = {
    ...userData,
    id: `user_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  return newUser;
};

// Shop functions
export const getShops = (): Shop[] => {
  return JSON.parse(localStorage.getItem(KEYS.SHOPS) || '[]');
};

export const getShopById = (id: string): Shop | null => {
  const shops = getShops();
  return shops.find((s) => s.id === id) || null;
};

export const createShop = (shopData: Omit<Shop, 'id' | 'createdAt'>): Shop => {
  const shops = getShops();
  const newShop: Shop = {
    ...shopData,
    id: `shop_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  shops.push(newShop);
  localStorage.setItem(KEYS.SHOPS, JSON.stringify(shops));
  return newShop;
};

export const updateShop = (id: string, updates: Partial<Shop>) => {
  const shops = getShops();
  const index = shops.findIndex((s) => s.id === id);
  if (index !== -1) {
    shops[index] = { ...shops[index], ...updates };
    localStorage.setItem(KEYS.SHOPS, JSON.stringify(shops));
  }
};

// Slot functions
export const getSlots = (): Slot[] => {
  return JSON.parse(localStorage.getItem(KEYS.SLOTS) || '[]');
};

export const getSlotsByShop = (shopId: string): Slot[] => {
  const slots = getSlots();
  return slots.filter((s) => s.shopId === shopId);
};

export const createSlot = (slotData: Slot) => {
  const slots = getSlots();
  slots.push(slotData);
  localStorage.setItem(KEYS.SLOTS, JSON.stringify(slots));
};

export const updateSlot = (id: string, updates: Partial<Slot>) => {
  const slots = getSlots();
  const index = slots.findIndex((s) => s.id === id);
  if (index !== -1) {
    slots[index] = { ...slots[index], ...updates };
    localStorage.setItem(KEYS.SLOTS, JSON.stringify(slots));
  }
};

// Booking functions
export const getBookings = (): Booking[] => {
  return JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || '[]');
};

export const getBookingsByUser = (userId: string): Booking[] => {
  const bookings = getBookings();
  return bookings.filter((b) => b.beneficiaryId === userId);
};

export const getBookingsByShop = (shopId: string): Booking[] => {
  const bookings = getBookings();
  return bookings.filter((b) => b.shopId === shopId);
};

export const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
  const bookings = getBookings();
  const newBooking: Booking = {
    ...bookingData,
    id: `BKG${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  
  // Update slot booked count
  const slots = getSlots();
  const slotIndex = slots.findIndex((s) => s.id === bookingData.slotId);
  if (slotIndex !== -1) {
    slots[slotIndex].bookedCount += 1;
    // Deduct stock
    slots[slotIndex].availableStock.rice -= bookingData.entitlement.rice;
    slots[slotIndex].availableStock.wheat -= bookingData.entitlement.wheat;
    slots[slotIndex].availableStock.sugar -= bookingData.entitlement.sugar;
    slots[slotIndex].availableStock.kerosene -= bookingData.entitlement.kerosene;
    localStorage.setItem(KEYS.SLOTS, JSON.stringify(slots));
  }
  
  return newBooking;
};

export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
};

export const updateUser = (id: string, updates: Partial<User>) => {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }
};

export const deleteUser = (id: string) => {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  localStorage.setItem(KEYS.USERS, JSON.stringify(filtered));
};