import { useState, useEffect } from 'react';
import { Package, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { authService } from '../../../api/auth.service';
import { shopService } from '../../../api/shop.service';
import { slotService } from '../../../api/slot.service';
import { Navbar } from '../../components/shared/Navbar';
import { Sidebar } from '../../components/shared/Sidebar';
import { Shop, Slot } from '../../types';

export default function StockOverview() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

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
            localStorage.setItem('pds_current_user', JSON.stringify({ ...currentUser, shopId: shopData._id }));
          }
        }

        if (shopData) {
          setShop(shopData);
          const shopId = (shopData._id || shopData.id)!;
          const slotsData = await slotService.getSlotsByShop(shopId);
          setSlots(slotsData);
        }
      } catch (error) {
        console.error('Error loading stock overview:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

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

  // Calculate total available stock across all slots
  const totalAvailableStock = slots.reduce(
    (acc, slot) => ({
      rice: acc.rice + (slot.availableStock?.rice ?? 0),
      wheat: acc.wheat + (slot.availableStock?.wheat ?? 0),
      sugar: acc.sugar + (slot.availableStock?.sugar ?? 0),
      kerosene: acc.kerosene + (slot.availableStock?.kerosene ?? 0),
    }),
    { rice: 0, wheat: 0, sugar: 0, kerosene: 0 }
  );

  const totalStockLimit = slots.reduce(
    (acc, slot) => ({
      rice: acc.rice + (slot.stockLimit?.rice ?? 0),
      wheat: acc.wheat + (slot.stockLimit?.wheat ?? 0),
      sugar: acc.sugar + (slot.stockLimit?.sugar ?? 0),
      kerosene: acc.kerosene + (slot.stockLimit?.kerosene ?? 0),
    }),
    { rice: 0, wheat: 0, sugar: 0, kerosene: 0 }
  );

  const stockData = [
    { name: 'Rice', available: totalAvailableStock.rice, total: totalStockLimit.rice, color: 'blue' },
    { name: 'Wheat', available: totalAvailableStock.wheat, total: totalStockLimit.wheat, color: 'green' },
    { name: 'Sugar', available: totalAvailableStock.sugar, total: totalStockLimit.sugar, color: 'yellow' },
    { name: 'Kerosene', available: totalAvailableStock.kerosene, total: totalStockLimit.kerosene, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="shopkeeper" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">Stock Overview</h1>
              <p className="text-gray-600">Monitor inventory levels for {shop.name}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stockData.map((item) => {
                const percentage = item.total > 0 ? (item.available / item.total) * 100 : 0;
                const isLow = percentage < 30;

                return (
                  <Card key={item.name}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
                      <Package className={`h-4 w-4 text-${item.color}-600`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold text-gray-900">
                        {item.available} {item.name === 'Kerosene' ? 'L' : 'kg'}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        of {item.total} {item.name === 'Kerosene' ? 'L' : 'kg'} total
                      </p>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${isLow ? 'bg-red-600' : `bg-${item.color}-600`}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center mt-2">
                        {isLow ? (
                          <>
                            <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                            <span className="text-xs text-red-600 font-medium">Low Stock</span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                            <span className="text-xs text-green-600 font-medium">{percentage.toFixed(0)}% Available</span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Slot-wise Stock Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {slots.length > 0 ? (
                  <div className="space-y-4">
                    {slots.map((slot) => (
                      <div key={slot._id || slot.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {new Date(slot.date + 'T00:00:00').toLocaleDateString('en-IN')} - {slot.timeSlot}
                            </p>
                            <p className="text-sm text-gray-600">
                              {slot.bookedCount} / {slot.maxCapacity} bookings
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Rice</p>
                            <p className="font-semibold text-gray-900">{slot.availableStock?.rice}/{slot.stockLimit?.rice} kg</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Wheat</p>
                            <p className="font-semibold text-gray-900">{slot.availableStock?.wheat}/{slot.stockLimit?.wheat} kg</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Sugar</p>
                            <p className="font-semibold text-gray-900">{slot.availableStock?.sugar}/{slot.stockLimit?.sugar} kg</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Kerosene</p>
                            <p className="font-semibold text-gray-900">{slot.availableStock?.kerosene}/{slot.stockLimit?.kerosene} L</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    No slots created yet. Create slots in Slot Management to see stock data here.
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
