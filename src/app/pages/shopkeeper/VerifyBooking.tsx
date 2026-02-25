import { useState, useEffect, useRef } from 'react';
import { QrCode, Search, CheckCircle, XCircle, Loader2, Camera, CameraOff } from 'lucide-react';
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
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'sonner';

export default function VerifyBooking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; booking: Booking | null } | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [scannerLoading, setScannerLoading] = useState(false);
  const [shopId, setShopId] = useState<string | null>(null);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerDivId = 'qr-reader';

  // Load shop & recent bookings on mount
  useEffect(() => {
    const load = async () => {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) return;
      try {
        let sid = currentUser.shopId;
        if (!sid && currentUser._id) {
          const shop = await shopService.getShopByShopkeeper(currentUser._id);
          sid = shop?._id || shop?.id;
          if (sid) {
            localStorage.setItem('pds_current_user', JSON.stringify({ ...currentUser, shopId: sid }));
          }
        }
        if (sid) {
          setShopId(sid);
          const data = await bookingService.getBookingsByShop(sid);
          setRecentBookings(data.slice(0, 3));
        }
      } catch (e) {
        console.error('Failed to load bookings:', e);
      }
    };
    load();
  }, []);

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const verifyCode = async (code: string) => {
    if (!code.trim()) return;
    setVerifying(true);
    try {
      let sid = shopId;
      if (!sid) {
        const currentUser = authService.getCurrentUser();
        if (currentUser?._id) {
          const shop = await shopService.getShopByShopkeeper(currentUser._id);
          sid = shop?._id || shop?.id || null;
          setShopId(sid);
        }
      }
      if (!sid) {
        setVerificationResult({ success: false, booking: null });
        toast.error('Could not determine your shop');
        return;
      }
      const allBookings = await bookingService.getBookingsByShop(sid);
      const booking = allBookings.find(
        (b) => b._id === code || b.id === code || b.qrCode === code
      );
      setVerificationResult(booking ? { success: true, booking } : { success: false, booking: null });
    } catch (e) {
      setVerificationResult({ success: false, booking: null });
    } finally {
      setVerifying(false);
    }
  };

  const handleVerify = () => verifyCode(searchQuery);

  const startScanner = async () => {
    setScannerLoading(true);
    try {
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) {
        toast.error('No camera found on this device');
        setScannerLoading(false);
        return;
      }

      const qrCode = new Html5Qrcode(scannerDivId);
      html5QrCodeRef.current = qrCode;

      // Prefer back camera
      const camera = cameras.find((c) => c.label.toLowerCase().includes('back')) || cameras[cameras.length - 1];

      await qrCode.start(
        { deviceId: { exact: camera.id } },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        async (decodedText) => {
          // QR code scanned successfully
          await stopScanner();
          setSearchQuery(decodedText);
          toast.success('QR Code scanned!');
          await verifyCode(decodedText);
        },
        () => {
          // Scan error (frame without QR) — ignore
        }
      );
      setScannerActive(true);
    } catch (err: any) {
      console.error('Scanner error:', err);
      if (err?.message?.includes('Permission')) {
        toast.error('Camera permission denied. Please allow camera access.');
      } else {
        toast.error('Failed to start camera scanner');
      }
    } finally {
      setScannerLoading(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        const state = html5QrCodeRef.current.getState();
        if (state === 2) { // SCANNING
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
      } catch (e) {
        // Ignore cleanup errors
      }
      html5QrCodeRef.current = null;
    }
    setScannerActive(false);
  };

  const toggleScanner = () => {
    if (scannerActive) {
      stopScanner();
    } else {
      startScanner();
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

            {/* Camera QR Scanner Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Camera QR Scanner
                  </span>
                  <Button
                    onClick={toggleScanner}
                    variant={scannerActive ? 'destructive' : 'default'}
                    className="gap-2"
                    disabled={scannerLoading}
                  >
                    {scannerLoading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Starting...</>
                    ) : scannerActive ? (
                      <><CameraOff className="h-4 w-4" /> Stop Scanner</>
                    ) : (
                      <><Camera className="h-4 w-4" /> Start Scanner</>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* The scanner will render into this div when active */}
                <div
                  id={scannerDivId}
                  className={`rounded-lg overflow-hidden ${scannerActive ? 'block' : 'hidden'}`}
                />

                {!scannerActive && (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">Camera is off</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Click <strong>Start Scanner</strong> to scan a QR code
                      </p>
                    </div>
                  </div>
                )}

                {scannerActive && (
                  <p className="text-sm text-center text-gray-500 mt-3">
                    Point the camera at a booking QR code — it will verify automatically
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Manual Verification */}
            <Card>
              <CardHeader>
                <CardTitle>Manual Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Booking ID or QR Code value"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  />
                  <Button onClick={handleVerify} className="gap-2" disabled={verifying || !searchQuery.trim()}>
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
                          <h3 className="text-lg font-semibold text-green-900">Valid Booking ✓</h3>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Booking ID</p>
                            <p className="font-medium text-gray-900 font-mono text-sm">
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

            {/* Recent Bookings for quick testing */}
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
                          onClick={() => {
                            const id = (booking._id || booking.id)!;
                            setSearchQuery(id);
                            verifyCode(id);
                          }}
                        >
                          Verify
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
