import { useState, useEffect } from 'react';
import { Package, Calendar, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { authService } from '../../../api/auth.service';
import { shopService } from '../../../api/shop.service';
import { bookingService } from '../../../api/booking.service';
import { slotService } from '../../../api/slot.service';
import { Navbar } from '../../components/shared/Navbar';
import { Sidebar } from '../../components/shared/Sidebar';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Shop, Booking, Slot } from '../../types';

export default function ShopkeeperDashboard() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) { setLoading(false); return; }

      try {
        let shopData: Shop | null = null;

        // Try by shopId first, then fallback to shopkeeperId lookup
        if (currentUser.shopId) {
          shopData = await shopService.getShopById(currentUser.shopId);
        } else if (currentUser._id) {
          shopData = await shopService.getShopByShopkeeper(currentUser._id);
          // Cache the shopId in localStorage so next time is faster
          if (shopData?._id) {
            const updated = { ...currentUser, shopId: shopData._id };
            localStorage.setItem('pds_current_user', JSON.stringify(updated));
          }
        }

        if (shopData) {
          setShop(shopData);
          const shopId = (shopData._id || shopData.id)!;
          const [bookingsData, slotsData] = await Promise.all([
            bookingService.getBookingsByShop(shopId),
            slotService.getSlotsByShop(shopId),
          ]);
          setBookings(bookingsData);
          setSlots(slotsData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === today);
  const todaySlots = slots.filter(s => s.date === today);

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

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-12">
          <p className="text-gray-600">No shop found associated with your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="shopkeeper" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Shopkeeper Dashboard
              </h1>
              <p className="text-gray-600">{shop.name}</p>
            </div>

            {/* Shop Status Alert */}
            <Card className={`mb-6 ${shop.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
              shop.status === 'approved' ? 'border-green-200 bg-green-50' :
                'border-red-200 bg-red-50'
              }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Shop Status
                    </h3>
                    <p className="text-sm text-gray-600">
                      {shop.status === 'pending' && 'Your shop registration is pending admin approval'}
                      {shop.status === 'approved' && 'Your shop is approved and active'}
                      {shop.status === 'rejected' && 'Your shop registration was rejected'}
                    </p>
                  </div>
                  <StatusBadge status={shop.status} />
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Stock
                  </CardTitle>
                  <Package className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-gray-900">
                    {shop.totalStock} kg
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Available stock
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Today's Bookings
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-gray-900">
                    {todayBookings.length}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Bookings for today
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Slots
                  </CardTitle>
                  <Clock className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-gray-900">
                    {todaySlots.length}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Slots available today
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Slots */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Slot Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {todaySlots.length > 0 ? (
                  <div className="space-y-4">
                    {todaySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{slot.timeSlot}</p>
                          <p className="text-sm text-gray-600">
                            {slot.bookedCount} / {slot.maxCapacity} booked
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            Available Stock
                          </p>
                          <p className="text-xs text-gray-600">
                            Rice: {slot.availableStock.rice}kg | Wheat: {slot.availableStock.wheat}kg
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    No slots scheduled for today
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length > 0 ? (
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.beneficiaryName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.date).toLocaleDateString()} - {booking.timeSlot}
                          </p>
                        </div>
                        <StatusBadge status={booking.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    No bookings yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
