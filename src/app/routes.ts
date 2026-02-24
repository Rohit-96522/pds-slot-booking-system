import { createBrowserRouter } from 'react-router';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Beneficiary
import BeneficiaryHome from './pages/beneficiary/Home';
import ShopDetails from './pages/beneficiary/ShopDetails';
import BookSlot from './pages/beneficiary/BookSlot';
import BookingConfirmation from './pages/beneficiary/BookingConfirmation';
import MyBookings from './pages/beneficiary/MyBookings';

// Shopkeeper
import ShopkeeperDashboard from './pages/shopkeeper/Dashboard';
import SlotManagement from './pages/shopkeeper/SlotManagement';
import StockOverview from './pages/shopkeeper/StockOverview';
import VerifyBooking from './pages/shopkeeper/VerifyBooking';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import ShopApproval from './pages/admin/ShopApproval';
import StockManagement from './pages/admin/StockManagement';
import UserManagement from './pages/admin/UserManagement';
import Reports from './pages/admin/Reports';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/register',
    Component: Register,
  },
  // Beneficiary routes
  {
    path: '/beneficiary/home',
    Component: BeneficiaryHome,
  },
  {
    path: '/beneficiary/shop/:shopId',
    Component: ShopDetails,
  },
  {
    path: '/beneficiary/book-slot/:shopId',
    Component: BookSlot,
  },
  {
    path: '/beneficiary/booking-confirmation/:bookingId',
    Component: BookingConfirmation,
  },
  {
    path: '/beneficiary/my-bookings',
    Component: MyBookings,
  },
  // Shopkeeper routes
  {
    path: '/shopkeeper/dashboard',
    Component: ShopkeeperDashboard,
  },
  {
    path: '/shopkeeper/slot-management',
    Component: SlotManagement,
  },
  {
    path: '/shopkeeper/stock-overview',
    Component: StockOverview,
  },
  {
    path: '/shopkeeper/verify-booking',
    Component: VerifyBooking,
  },
  // Admin routes
  {
    path: '/admin/dashboard',
    Component: AdminDashboard,
  },
  {
    path: '/admin/shop-approval',
    Component: ShopApproval,
  },
  {
    path: '/admin/stock-management',
    Component: StockManagement,
  },
  {
    path: '/admin/user-management',
    Component: UserManagement,
  },
  {
    path: '/admin/reports',
    Component: Reports,
  },
]);
