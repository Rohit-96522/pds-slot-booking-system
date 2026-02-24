import { useParams, useNavigate } from 'react-router';
import { MapPin, Package, ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getShopById, getSlotsByShop } from '../../utils/storage';
import { Navbar } from '../../components/shared/Navbar';

export default function ShopDetails() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const shop = shopId ? getShopById(shopId) : null;
  const slots = shopId ? getSlotsByShop(shopId) : [];

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Shop not found</p>
        </div>
      </div>
    );
  }

  const todaySlots = slots.filter(slot => slot.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/beneficiary/home')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shops
        </Button>

        <Card className="mb-6">
          <div className="aspect-video bg-gray-200 overflow-hidden rounded-t-lg">
            <img
              src={shop.image}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              {shop.name}
            </h1>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{shop.address}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Package className="h-5 w-5 flex-shrink-0" />
                <span>Total Stock Available: {shop.totalStock} kg</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Available Stock Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {todaySlots.length > 0 ? (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Rice</p>
                    <p className="text-2xl font-semibold text-blue-700">
                      {todaySlots[0].availableStock.rice} kg
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Wheat</p>
                    <p className="text-2xl font-semibold text-green-700">
                      {todaySlots[0].availableStock.wheat} kg
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Sugar</p>
                    <p className="text-2xl font-semibold text-yellow-700">
                      {todaySlots[0].availableStock.sugar} kg
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Kerosene</p>
                    <p className="text-2xl font-semibold text-purple-700">
                      {todaySlots[0].availableStock.kerosene} L
                    </p>
                  </div>
                </>
              ) : (
                <p className="col-span-4 text-center text-gray-600 py-4">
                  No slots available for today
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center">
          <Button
            size="lg"
            onClick={() => navigate(`/beneficiary/book-slot/${shopId}`)}
            disabled={todaySlots.length === 0}
            className="gap-2"
          >
            <Calendar className="h-5 w-5" />
            Book a Slot
          </Button>
        </div>
      </div>
    </div>
  );
}
