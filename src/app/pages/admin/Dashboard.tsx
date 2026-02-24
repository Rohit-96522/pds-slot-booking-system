import { useState, useEffect } from 'react';
import { Users, Store, Calendar, Package, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { userService } from '../../../api/user.service';
import { shopService } from '../../../api/shop.service';
import { bookingService } from '../../../api/booking.service';
import { Navbar } from '../../components/shared/Navbar';
import { Sidebar } from '../../components/shared/Sidebar';
import { User, Shop, Booking } from '../../types';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, shopsData, bookingsData] = await Promise.all([
          userService.getAllUsers(),
          shopService.getAllShops(),
          bookingService.getAllBookings()
        ]);
        setUsers(usersData);
        setShops(shopsData);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = {
    totalUsers: users.filter((u) => u.role === 'beneficiary').length,
    totalShops: shops.filter((s) => s.status === 'approved').length,
    pendingShops: shops.filter((s) => s.status === 'pending').length,
    totalBookings: bookings.length,
    totalStock: shops.reduce((acc, shop) => acc + (shop.totalStock || 0), 0),
  };

  const recentBookings = bookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Overview of PDS Slot Booking System
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.totalUsers}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Registered beneficiaries
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Shops
                  </CardTitle>
                  <Store className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.totalShops}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {stats.pendingShops} pending approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Bookings
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.totalBookings}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    All time bookings
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Stock
                  </CardTitle>
                  <Package className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.totalStock} kg
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Across all shops
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentBookings.length > 0 ? (
                    <div className="space-y-3">
                      {recentBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {booking.beneficiaryName}
                            </p>
                            <p className="text-xs text-gray-600">
                              {booking.shopName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">
                              {new Date(booking.date).toLocaleDateString('en-IN')}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.timeSlot}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 py-8">
                      No bookings yet
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Shop Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.pendingShops > 0 ? (
                    <div className="space-y-3">
                      {shops
                        .filter((s) => s.status === 'pending')
                        .slice(0, 5)
                        .map((shop) => (
                          <div
                            key={shop.id}
                            className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                          >
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {shop.name}
                              </p>
                              <p className="text-xs text-gray-600 line-clamp-1">
                                {shop.address}
                              </p>
                            </div>
                            <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                              Pending
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 py-8">
                      No pending approvals
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
