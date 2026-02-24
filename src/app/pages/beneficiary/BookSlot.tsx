import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Calendar, Clock, Package, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { getShopById, getSlotsByShop, getCurrentUser, createBooking } from '../../utils/storage';
import { calculateEntitlement, isStockAvailable } from '../../utils/calculations';
import { Navbar } from '../../components/shared/Navbar';
import { toast } from 'sonner';
import { Input } from '../../components/ui/input';

export default function BookSlot() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  const shop = shopId ? getShopById(shopId) : null;
  const currentUser = getCurrentUser();
  const slots = shopId ? getSlotsByShop(shopId) : [];

  if (!shop || !currentUser) {
    return <div>Loading...</div>;
  }

  const entitlement = calculateEntitlement(currentUser.familyMembers || 4);
  
  // Get unique dates
  const availableDates = Array.from(new Set(slots.map(s => s.date))).sort();
  
  // Get slots for selected date
  const dateSlots = selectedDate ? slots.filter(s => s.date === selectedDate) : [];
  
  const selectedSlotData = dateSlots.find(s => s.id === selectedSlot);

  const handleConfirmBooking = () => {
    if (!selectedSlotData) return;

    if (!isStockAvailable(entitlement, selectedSlotData.availableStock)) {
      toast.error('Insufficient stock for your entitlement');
      return;
    }

    const booking = createBooking({
      beneficiaryId: currentUser.id,
      beneficiaryName: currentUser.name,
      shopId: shop.id,
      shopName: shop.name,
      slotId: selectedSlotData.id,
      date: selectedSlotData.date,
      timeSlot: selectedSlotData.timeSlot,
      entitlement,
      status: 'confirmed',
      qrCode: `BKG-${Date.now()}-${currentUser.id}`,
    });

    toast.success('Booking confirmed successfully!');
    navigate(`/beneficiary/booking-confirmation/${booking.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/beneficiary/shop/${shopId}`)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop Details
        </Button>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Book Your Slot
          </h1>
          <p className="text-gray-600">{shop.name}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <span className="text-sm font-medium text-gray-700">Select Date</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300 mx-2" />
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <span className="text-sm font-medium text-gray-700">Select Slot</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300 mx-2" />
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
            <span className="text-sm font-medium text-gray-700">Confirm</span>
          </div>
        </div>

        {/* Step 1: Select Date */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableDates.map((date) => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setStep(2);
                  }}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(date).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {slots.filter(s => s.date === date).length} slots available
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Slot */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Select Time Slot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Selected Date: {new Date(selectedDate).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {dateSlots.map((slot) => {
                const available = slot.maxCapacity - slot.bookedCount;
                const canBook = available > 0 && isStockAvailable(entitlement, slot.availableStock);
                
                return (
                  <button
                    key={slot.id}
                    onClick={() => {
                      if (canBook) {
                        setSelectedSlot(slot.id);
                        setStep(3);
                      }
                    }}
                    disabled={!canBook}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                      canBook
                        ? 'border-gray-200 hover:border-blue-600 hover:bg-blue-50'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{slot.timeSlot}</p>
                        <p className="text-sm text-gray-600">
                          {available} / {slot.maxCapacity} slots available
                        </p>
                      </div>
                      {!canBook && (
                        <span className="text-sm text-red-600 font-medium">
                          {available === 0 ? 'Fully Booked' : 'Low Stock'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
              <Button variant="outline" onClick={() => setStep(1)} className="mt-4">
                Change Date
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && selectedSlotData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Confirm Your Booking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-600">Date</Label>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Time Slot</Label>
                  <p className="font-medium text-gray-900">{selectedSlotData.timeSlot}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Beneficiary</Label>
                  <p className="font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-sm text-gray-600">Card: {currentUser.cardNumber}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Your Ration Entitlement
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Rice</p>
                    <p className="text-xl font-semibold text-blue-700">{entitlement.rice} kg</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Wheat</p>
                    <p className="text-xl font-semibold text-green-700">{entitlement.wheat} kg</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Sugar</p>
                    <p className="text-xl font-semibold text-yellow-700">{entitlement.sugar} kg</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Kerosene</p>
                    <p className="text-xl font-semibold text-purple-700">{entitlement.kerosene} L</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-4">
                  * Based on {currentUser.familyMembers} family members
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleConfirmBooking} className="flex-1">
                  Confirm Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
