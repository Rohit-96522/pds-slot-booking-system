import { Link, useNavigate } from 'react-router';
import { Store, LogOut, User } from 'lucide-react';
import { Button } from '../ui/button';
import { getCurrentUser, logout } from '../../utils/storage';

export function Navbar() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!currentUser) return '/';
    switch (currentUser.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'shopkeeper':
        return '/shopkeeper/dashboard';
      case 'beneficiary':
        return '/beneficiary/home';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={getDashboardLink()} className="flex items-center gap-2">
              <Store className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  PDS Slot Booking
                </h1>
                <p className="text-xs text-gray-600">Public Distribution System</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-600 capitalize">
                      {currentUser.role}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
