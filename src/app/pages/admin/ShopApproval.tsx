import { useState } from 'react';
import { Store, Check, X, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { getShops, updateShop } from '../../utils/storage';
import { Navbar } from '../../components/shared/Navbar';
import { Sidebar } from '../../components/shared/Sidebar';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { toast } from 'sonner';

export default function ShopApproval() {
  const [shops, setShops] = useState(getShops());
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleApprove = (shopId: string) => {
    updateShop(shopId, { status: 'approved' });
    setShops(getShops());
    toast.success('Shop approved successfully!');
  };

  const handleReject = (shopId: string) => {
    updateShop(shopId, { status: 'rejected' });
    setShops(getShops());
    toast.error('Shop rejected');
  };

  const viewDetails = (shop: any) => {
    setSelectedShop(shop);
    setDialogOpen(true);
  };

  const pendingShops = shops.filter((s) => s.status === 'pending');
  const approvedShops = shops.filter((s) => s.status === 'approved');
  const rejectedShops = shops.filter((s) => s.status === 'rejected');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Shop Approval Management
              </h1>
              <p className="text-gray-600">
                Review and approve shop registrations
              </p>
            </div>

            {/* Pending Shops */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Pending Approvals ({pendingShops.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingShops.length > 0 ? (
                  <div className="space-y-4">
                    {pendingShops.map((shop) => (
                      <div
                        key={shop.id}
                        className="border rounded-lg p-4 bg-yellow-50 border-yellow-200"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex gap-4">
                            {shop.image && (
                              <img
                                src={shop.image}
                                alt={shop.name}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">
                                {shop.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {shop.address}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Registered:{' '}
                                {new Date(shop.createdAt).toLocaleDateString('en-IN')}
                              </p>
                            </div>
                          </div>
                          <StatusBadge status={shop.status} />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewDetails(shop)}
                            className="gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(shop.id)}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(shop.id)}
                            className="gap-2"
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    No pending approvals
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Approved Shops */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Approved Shops ({approvedShops.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {approvedShops.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {approvedShops.map((shop) => (
                      <div
                        key={shop.id}
                        className="border rounded-lg p-4 bg-green-50 border-green-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {shop.name}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                              {shop.address}
                            </p>
                          </div>
                          <StatusBadge status={shop.status} />
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-sm text-gray-600">
                            Stock: {shop.totalStock} kg
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewDetails(shop)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    No approved shops yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rejected Shops */}
            {rejectedShops.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Rejected Shops ({rejectedShops.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {rejectedShops.map((shop) => (
                      <div
                        key={shop.id}
                        className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{shop.name}</p>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {shop.address}
                          </p>
                        </div>
                        <StatusBadge status={shop.status} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Shop Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Shop Details</DialogTitle>
          </DialogHeader>
          {selectedShop && (
            <div className="space-y-4">
              {selectedShop.image && (
                <img
                  src={selectedShop.image}
                  alt={selectedShop.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <div>
                <p className="text-sm text-gray-600">Shop Name</p>
                <p className="font-medium text-gray-900">{selectedShop.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium text-gray-900">{selectedShop.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <StatusBadge status={selectedShop.status} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Stock</p>
                  <p className="font-medium text-gray-900">
                    {selectedShop.totalStock} kg
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Registered On</p>
                <p className="font-medium text-gray-900">
                  {new Date(selectedShop.createdAt).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
