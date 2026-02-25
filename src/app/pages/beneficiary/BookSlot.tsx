import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Calendar, Clock, Package, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { authService } from '../../../api/auth.service';
import { shopService } from '../../../api/shop.service';
import { slotService } from '../../../api/slot.service';
import { bookingService } from '../../../api/booking.service';
import { calculateEntitlement, isStockAvailable } from '../../utils/calculations';
import { Navbar } from '../../components/shared/Navbar';
import { toast } from 'sonner';
import { Shop, Slot } from '../../types';

export default function BookSlot() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      if (!shopId) { setLoading(false); return; }
      try {
        const [shopData, slotsData] = await Promise.all([
          shopService.getShopById(shopId),
          slotService.getSlotsByShop(shopId),
        ]);
        setShop(shopData);
        setSlots(slotsData);
      } catch (e) {
        toast.error('Failed to load shop details');
      }
      setLoading(false);
    };
    fetchData();
  }, [shopId]);

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

  if (!shop || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-8 text-gray-600">Shop not found.</div>
      </div>
    );
  }

  const entitlement = calculateEntitlement(currentUser.familyMembers || 4);
  const availableDates = Array.from(new Set(slots.map((s) => s.date))).sort();
  const dateSlots = selectedDate ? slots.filter((s) => s.date === selectedDate) : [];
  const selectedSlotData = dateSlots.find((s) => (s._id || s.id) === selectedSlotId);

  const handleConfirmBooking = async () => {
    if (!selectedSlotData) return;
    if (!isStockAvailable(entitlement, selectedSlotData.availableStock)) {
      toast.error('Insufficient stock for your entitlement');
      return;
    }
    setSubmitting(true);
    try {
      const shopIdVal = (shop._id || shop.id)!;
      const slotIdVal = (selectedSlotData._id || selectedSlotData.id)!;
      const userId = (currentUser._id || currentUser.id)!;

      const booking = await bookingService.createBooking({
        beneficiaryId: userId,
        beneficiaryName: currentUser.name,
        shopId: shopIdVal,
        shopName: shop.name,
        slotId: slotIdVal,
        date: selectedSlotData.date,
        timeSlot: selectedSlotData.timeSlot,
        entitlement,
        status: 'confirmed',
        qrCode: `BKG-${Date.now()}-${userId}`,
      });

      toast.success('Booking confirmed successfully!');
      const bookingId = (booking as any)._id || booking.id;
      navigate(`/beneficiary/booking-confirmation/${bookingId}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate(`/beneficiary/shop/${shopId}`)} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Shop Details
        </Button>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Book Your Slot</h1>
          <p className="text-gray-600">{shop.name}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>{s}</div>
                <span className="text-sm font-medium text-gray-700">
                  {['Select Date', 'Select Slot', 'Confirm'][i]}
                </span>
              </div>
              {i < 2 && <div className="w-12 h-0.5 bg-gray-300 mx-2" />}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> Select Date</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableDates.length > 0 ? availableDates.map((date) => (
                <button key={date}
                  onClick={() => { setSelectedDate(date); setStep(2); }}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-left">
                  <p className="font-medium text-gray-900">
                    {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-gray-600">{slots.filter((s) => s.date === date).length} slots available</p>
                </button>
              )) : (
                <p className="text-center text-gray-600 py-4">No available slots for this shop yet.</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Select Time Slot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Selected: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
              {dateSlots.map((slot) => {
                const slotId = (slot._id || slot.id)!;
                const available = slot.maxCapacity - slot.bookedCount;
                const canBook = available > 0 && isStockAvailable(entitlement, slot.availableStock);
                return (
                  <button key={slotId}
                    onClick={() => { if (canBook) { setSelectedSlotId(slotId); setStep(3); } }}
                    disabled={!canBook}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${canBook ? 'border-gray-200 hover:border-blue-600 hover:bg-blue-50' : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                      }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{slot.timeSlot}</p>
                        <p className="text-sm text-gray-600">{available} / {slot.maxCapacity} slots available</p>
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
              <Button variant="outline" onClick={() => setStep(1)} className="mt-4">Change Date</Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3 */}
        {step === 3 && selectedSlotData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5" /> Confirm Your Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-600">Date</Label>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
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
                  <p className="text-sm text-gray-600">Card: {currentUser.cardNumber || '—'}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" /> Your Ration Entitlement
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
                <p className="text-xs text-gray-600 mt-4">* Based on {currentUser.familyMembers || 4} family members</p>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                <Button onClick={handleConfirmBooking} className="flex-1" disabled={submitting}>
                  {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Confirming...</> : 'Confirm Booking'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
