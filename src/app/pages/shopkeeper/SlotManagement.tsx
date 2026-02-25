import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Users, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { authService } from '../../../api/auth.service';
import { shopService } from '../../../api/shop.service';
import { slotService } from '../../../api/slot.service';
import { Navbar } from '../../components/shared/Navbar';
import { Sidebar } from '../../components/shared/Sidebar';
import { toast } from 'sonner';
import { Shop, Slot } from '../../types';

export default function SlotManagement() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:00 - 11:00',
    maxCapacity: '20',
    rice: '500',
    wheat: '400',
    sugar: '100',
    kerosene: '50',
  });

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) { setLoading(false); return; }

      try {
        let shopData: Shop | null = null;

        if (currentUser.shopId) {
          shopData = await shopService.getShopById(currentUser.shopId);
        } else if (currentUser._id) {
          shopData = await shopService.getShopByShopkeeper(currentUser._id);
          if (shopData?._id) {
            const updated = { ...currentUser, shopId: shopData._id };
            localStorage.setItem('pds_current_user', JSON.stringify(updated));
          }
        }

        if (shopData) {
          setShop(shopData);
          const shopId = (shopData._id || shopData.id)!;
          const slotsData = await slotService.getSlotsByShop(shopId);
          setSlots(slotsData);
        }
      } catch (error) {
        console.error('Error loading slot management data:', error);
        toast.error('Failed to load shop data');
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;
    setSubmitting(true);

    try {
      const shopId = (shop._id || shop.id)!;
      const newSlot = await slotService.createSlot({
        shopId,
        date: formData.date,
        timeSlot: formData.timeSlot,
        maxCapacity: parseInt(formData.maxCapacity),
        bookedCount: 0,
        stockLimit: {
          rice: parseInt(formData.rice),
          wheat: parseInt(formData.wheat),
          sugar: parseInt(formData.sugar),
          kerosene: parseInt(formData.kerosene),
        },
        availableStock: {
          rice: parseInt(formData.rice),
          wheat: parseInt(formData.wheat),
          sugar: parseInt(formData.sugar),
          kerosene: parseInt(formData.kerosene),
        },
      });

      setSlots((prev) => [...prev, newSlot]);
      toast.success('Slot created successfully!');
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to create slot');
    } finally {
      setSubmitting(false);
    }
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

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="shopkeeper" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">Slot Management</h1>
                <p className="text-gray-600">Create and manage booking slots for {shop.name}</p>
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Slot
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Slot</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateSlot} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timeSlot">Time Slot</Label>
                        <Input
                          id="timeSlot"
                          placeholder="e.g., 09:00 - 11:00"
                          value={formData.timeSlot}
                          onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxCapacity">Max Capacity (People)</Label>
                      <Input
                        id="maxCapacity"
                        type="number"
                        min="1"
                        value={formData.maxCapacity}
                        onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label className="mb-4 block">Stock Limit for this Slot</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="rice">Rice (kg)</Label>
                          <Input id="rice" type="number" min="0" value={formData.rice}
                            onChange={(e) => setFormData({ ...formData, rice: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="wheat">Wheat (kg)</Label>
                          <Input id="wheat" type="number" min="0" value={formData.wheat}
                            onChange={(e) => setFormData({ ...formData, wheat: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sugar">Sugar (kg)</Label>
                          <Input id="sugar" type="number" min="0" value={formData.sugar}
                            onChange={(e) => setFormData({ ...formData, sugar: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="kerosene">Kerosene (L)</Label>
                          <Input id="kerosene" type="number" min="0" value={formData.kerosene}
                            onChange={(e) => setFormData({ ...formData, kerosene: e.target.value })} required />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1" disabled={submitting}>
                        {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : 'Create Slot'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {Object.keys(slotsByDate).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(slotsByDate).sort().map(([date, dateSlots]) => (
                  <Card key={date}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {dateSlots.map((slot) => (
                          <div key={slot._id || slot.id}
                            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Clock className="h-4 w-4 text-gray-600" />
                                  <span className="font-medium text-gray-900">{slot.timeSlot}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Users className="h-4 w-4" />
                                  <span>{slot.bookedCount} / {slot.maxCapacity} bookings</span>
                                </div>
                              </div>
                              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${slot.bookedCount >= slot.maxCapacity
                                  ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                }`}>
                                {slot.bookedCount >= slot.maxCapacity ? 'Full' : 'Available'}
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                              <div className="bg-blue-50 p-3 rounded">
                                <p className="text-xs text-gray-600 mb-1">Rice</p>
                                <p className="font-semibold text-blue-700">
                                  {slot.availableStock.rice}/{slot.stockLimit.rice} kg
                                </p>
                              </div>
                              <div className="bg-green-50 p-3 rounded">
                                <p className="text-xs text-gray-600 mb-1">Wheat</p>
                                <p className="font-semibold text-green-700">
                                  {slot.availableStock.wheat}/{slot.stockLimit.wheat} kg
                                </p>
                              </div>
                              <div className="bg-yellow-50 p-3 rounded">
                                <p className="text-xs text-gray-600 mb-1">Sugar</p>
                                <p className="font-semibold text-yellow-700">
                                  {slot.availableStock.sugar}/{slot.stockLimit.sugar} kg
                                </p>
                              </div>
                              <div className="bg-purple-50 p-3 rounded">
                                <p className="text-xs text-gray-600 mb-1">Kerosene</p>
                                <p className="font-semibold text-purple-700">
                                  {slot.availableStock.kerosene}/{slot.stockLimit.kerosene} L
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No slots created yet</h3>
                  <p className="text-gray-600 mb-6">Create your first slot to start accepting bookings</p>
                  <Button onClick={() => setOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create First Slot
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
