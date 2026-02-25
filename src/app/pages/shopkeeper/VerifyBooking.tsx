import { useState, useEffect } from 'react';
import { QrCode, Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { bookingService } from '../../../api/booking.service';
import { authService } from '../../../api/auth.service';
import { shopService } from '../../../api/shop.service';
import { Navbar } from '../../components/shared/Navbar';
import { Sidebar } from '../../components/shared/Sidebar';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Booking } from '../../types';

export default function VerifyBooking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; booking: Booking | null } | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const load = async () => {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) return;
      try {
        let shopId = currentUser.shopId;
        if (!shopId && currentUser._id) {
          const shop = await shopService.getShopByShopkeeper(currentUser._id);
          shopId = shop?._id || shop?.id;
          if (shopId) {
            localStorage.setItem('pds_current_user', JSON.stringify({ ...currentUser, shopId }));
          }
        }
        if (shopId) {
          const data = await bookingService.getBookingsByShop(shopId);
          setRecentBookings(data.slice(0, 3));
        }
      } catch (e) {
        console.error('Failed to load bookings:', e);
      }
    };
    load();
  }, []);

  const handleVerify = async () => {
    if (!searchQuery.trim()) return;
    setVerifying(true);
    try {
      const currentUser = authService.getCurrentUser();
      let shopId = currentUser?.shopId;
      if (!shopId && currentUser?._id) {
        const shop = await shopService.getShopByShopkeeper(currentUser._id);
        shopId = shop?._id || shop?.id;
      }
      if (!shopId) {
        setVerificationResult({ success: false, booking: null });
        return;
      }
      const allBookings = await bookingService.getBookingsByShop(shopId);
      const booking = allBookings.find(
        (b) => (b._id === searchQuery || b.id === searchQuery || b.qrCode === searchQuery)
      );
      setVerificationResult(booking ? { success: true, booking } : { success: false, booking: null });
    } catch (e) {
      setVerificationResult({ success: false, booking: null });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="shopkeeper" />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">Verify Booking</h1>
              <p className="text-gray-600">Scan QR code or enter booking ID to verify</p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code Scanner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Camera access would be required for QR scanning</p>
                    <p className="text-sm text-gray-500 mt-1">Use manual verification below</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manual Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Booking ID or QR Code"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  />
                  <Button onClick={handleVerify} className="gap-2" disabled={verifying}>
                    {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    Verify
                  </Button>
                </div>

                {verificationResult && (
                  <div className={`p-6 rounded-lg border-2 ${verificationResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                    {verificationResult.success && verificationResult.booking ? (
                      <>
                        <div className="flex items-center gap-2 mb-4">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                          <h3 className="text-lg font-semibold text-green-900">Valid Booking</h3>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Booking ID</p>
                            <p className="font-medium text-gray-900 font-mono">
                              {verificationResult.booking._id || verificationResult.booking.id}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Beneficiary</p>
                            <p className="font-medium text-gray-900">{verificationResult.booking.beneficiaryName}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Date</p>
                              <p className="font-medium text-gray-900">
                                {new Date(verificationResult.booking.date).toLocaleDateString('en-IN')}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Time Slot</p>
                              <p className="font-medium text-gray-900">{verificationResult.booking.timeSlot}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Status</p>
                            <StatusBadge status={verificationResult.booking.status} />
                          </div>
                          <div className="border-t pt-4 mt-4">
                            <p className="text-sm font-medium text-gray-900 mb-3">Entitlement</p>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white p-3 rounded">
                                <p className="text-xs text-gray-600">Rice</p>
                                <p className="font-semibold text-gray-900">{verificationResult.booking.entitlement?.rice} kg</p>
                              </div>
                              <div className="bg-white p-3 rounded">
                                <p className="text-xs text-gray-600">Wheat</p>
                                <p className="font-semibold text-gray-900">{verificationResult.booking.entitlement?.wheat} kg</p>
                              </div>
                              <div className="bg-white p-3 rounded">
                                <p className="text-xs text-gray-600">Sugar</p>
                                <p className="font-semibold text-gray-900">{verificationResult.booking.entitlement?.sugar} kg</p>
                              </div>
                              <div className="bg-white p-3 rounded">
                                <p className="text-xs text-gray-600">Kerosene</p>
                                <p className="font-semibold text-gray-900">{verificationResult.booking.entitlement?.kerosene} L</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="h-6 w-6 text-red-600" />
                          <h3 className="text-lg font-semibold text-red-900">Invalid Booking</h3>
                        </div>
                        <p className="text-red-700">No booking found with the provided ID or QR code.</p>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {recentBookings.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Booking IDs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">Click to test verification:</p>
                  <div className="space-y-2">
                    {recentBookings.map((booking) => (
                      <div
                        key={booking._id || booking.id}
                        className="p-3 bg-gray-50 rounded border flex items-center justify-between"
                      >
                        <div>
                          <p className="font-mono text-sm font-medium text-gray-900">
                            {booking._id || booking.id}
                          </p>
                          <p className="text-xs text-gray-600">{booking.beneficiaryName}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setSearchQuery(booking._id || booking.id); }}
                        >
                          Use
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
