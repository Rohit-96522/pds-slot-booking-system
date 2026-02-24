import { useParams, Link } from 'react-router';
import { CheckCircle, Calendar, Clock, MapPin, Package, Download, Home } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getBookings } from '../../utils/storage';
import { Navbar } from '../../components/shared/Navbar';
import { QRCodeSVG } from 'qrcode.react';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const bookings = getBookings();
  const booking = bookings.find(b => b.id === bookingId);

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Booking not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your slot has been successfully booked
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-center">Booking ID: {booking.id}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* QR Code */}
            <div className="flex justify-center py-6 bg-white border-2 border-dashed border-gray-300 rounded-lg">
              <QRCodeSVG
                value={booking.qrCode}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-center text-sm text-gray-600">
              Show this QR code at the shop to collect your ration
            </p>

            {/* Booking Details */}
            <div className="border-t pt-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Shop Name</p>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {booking.shopName}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(booking.date).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Time Slot</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {booking.timeSlot}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Beneficiary</p>
                <p className="font-medium text-gray-900">{booking.beneficiaryName}</p>
              </div>
            </div>

            {/* Entitlement */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Your Ration Entitlement
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Rice</p>
                  <p className="text-lg font-semibold text-blue-700">
                    {booking.entitlement.rice} kg
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Wheat</p>
                  <p className="text-lg font-semibold text-green-700">
                    {booking.entitlement.wheat} kg
                  </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Sugar</p>
                  <p className="text-lg font-semibold text-yellow-700">
                    {booking.entitlement.sugar} kg
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Kerosene</p>
                  <p className="text-lg font-semibold text-purple-700">
                    {booking.entitlement.kerosene} L
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Please carry your ration card and a valid ID proof when visiting the shop.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1 gap-2">
            <Download className="h-4 w-4" />
            Download Receipt
          </Button>
          <Link to="/beneficiary/home" className="flex-1">
            <Button className="w-full gap-2">
              <Home className="h-4 w-4" />
              Go to Home
            </Button>
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link to="/beneficiary/my-bookings" className="text-blue-600 hover:underline text-sm">
            View all my bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
