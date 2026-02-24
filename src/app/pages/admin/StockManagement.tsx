import { useState } from 'react';
import { Package, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { getShops, updateShop } from '../../utils/storage';
import { Navbar } from '../../components/shared/Navbar';
import { Sidebar } from '../../components/shared/Sidebar';
import { toast } from 'sonner';

export default function StockManagement() {
  const [shops, setShops] = useState(getShops().filter((s) => s.status === 'approved'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState('');
  const [stockAmount, setStockAmount] = useState('');

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    
    const shop = shops.find((s) => s.id === selectedShopId);
    if (shop) {
      const newStock = shop.totalStock + parseInt(stockAmount);
      updateShop(selectedShopId, { totalStock: newStock });
      setShops(getShops().filter((s) => s.status === 'approved'));
      toast.success(`Added ${stockAmount} kg to ${shop.name}`);
      setDialogOpen(false);
      setStockAmount('');
      setSelectedShopId('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                  Stock Management
                </h1>
                <p className="text-gray-600">
                  Allocate and manage stock across shops
                </p>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Stock
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Stock to Shop</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddStock} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="shop">Select Shop</Label>
                      <Select value={selectedShopId} onValueChange={setSelectedShopId} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a shop" />
                        </SelectTrigger>
                        <SelectContent>
                          {shops.map((shop) => (
                            <SelectItem key={shop.id} value={shop.id}>
                              {shop.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Stock Amount (kg)</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        value={stockAmount}
                        onChange={(e) => setStockAmount(e.target.value)}
                        placeholder="Enter stock amount"
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1">
                        Add Stock
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop) => (
                <Card key={shop.id}>
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span className="text-base">{shop.name}</span>
                      <Package className="h-5 w-5 text-blue-600" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Stock</p>
                        <p className="text-3xl font-semibold text-gray-900">
                          {shop.totalStock}
                          <span className="text-base text-gray-600 ml-1">kg</span>
                        </p>
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-xs text-gray-600 mb-2">Address</p>
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {shop.address}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedShopId(shop.id);
                          setDialogOpen(true);
                        }}
                      >
                        Add Stock
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {shops.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No approved shops
                  </h3>
                  <p className="text-gray-600">
                    Approve shops to start managing stock
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
