import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Store,
  Package,
  Users,
  FileText,
  Calendar,
  QrCode,
  CheckCircle,
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  role: UserRole;
}

const adminLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/shop-approval', icon: CheckCircle, label: 'Shop Approval' },
  { to: '/admin/stock-management', icon: Package, label: 'Stock Management' },
  { to: '/admin/user-management', icon: Users, label: 'User Management' },
  { to: '/admin/reports', icon: FileText, label: 'Reports' },
];

const shopkeeperLinks = [
  { to: '/shopkeeper/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/shopkeeper/slot-management', icon: Calendar, label: 'Slot Management' },
  { to: '/shopkeeper/stock-overview', icon: Package, label: 'Stock Overview' },
  { to: '/shopkeeper/verify-booking', icon: QrCode, label: 'Verify Booking' },
];

export function Sidebar({ role }: SidebarProps) {
  const location = useLocation();
  const links = role === 'admin' ? adminLinks : shopkeeperLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
