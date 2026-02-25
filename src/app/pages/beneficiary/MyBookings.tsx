import { useState, useEffect } from 'react';
import { Calendar, Clock, Package, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { authService } from '../../../api/auth.service';
import { bookingService } from '../../../api/booking.service';
import { Navbar } from '../../components/shared/Navbar';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking } from '../../types';

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        try {
          const userId = (currentUser as any)._id || currentUser.id;
          const data = await bookingService.getBookingsByUser(userId);
          setBookings(data.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ));
        } catch (error) {
          console.error('Failed to fetch bookings', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const toggleExpand = (bookingId: string) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600">
            View and manage your ration slot bookings
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't made any bookings. Start by finding a nearby shop.
              </p>
              <Button onClick={() => window.location.href = '/beneficiary/home'}>
                Browse Shops
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const bookingId = (booking._id || booking.id)!;
              return (
                <Card key={bookingId} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">
                            {booking.shopName}
                          </h3>
                          <p className="text-sm text-gray-600 font-mono text-xs">
                            ID: {bookingId}
                          </p>
                        </div>
                        <StatusBadge status={booking.status} />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {new Date(booking.date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {booking.timeSlot}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpand(bookingId)}
                        className="w-full gap-2"
                      >
                        {expandedBooking === bookingId ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Hide QR Code & Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            Show QR Code & Details
                          </>
                        )}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {expandedBooking === bookingId && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t bg-gray-50 p-6 space-y-6">
                            {/* QR Code */}
                            <div className="flex justify-center py-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                              <QRCodeSVG
                                value={booking.qrCode}
                                size={180}
                                level="H"
                                includeMargin={true}
                              />
                            </div>
                            <p className="text-center text-sm text-gray-600">
                              Show this QR code at the shop
                            </p>

                            {/* Entitlement */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Ration Entitlement
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-600">Rice</p>
                                  <p className="text-lg font-semibold text-blue-700">
                                    {booking.entitlement.rice} kg
                                  </p>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-600">Wheat</p>
                                  <p className="text-lg font-semibold text-green-700">
                                    {booking.entitlement.wheat} kg
                                  </p>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-600">Sugar</p>
                                  <p className="text-lg font-semibold text-yellow-700">
                                    {booking.entitlement.sugar} kg
                                  </p>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-lg">
                                  <p className="text-xs text-gray-600">Kerosene</p>
                                  <p className="text-lg font-semibold text-purple-700">
                                    {booking.entitlement.kerosene} L
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
