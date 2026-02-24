import { useState } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { getBookings, getShops } from '../../utils/storage';
import { Navbar } from '../../components/shared/Navbar';
import { Sidebar } from '../../components/shared/Sidebar';
import { StatusBadge } from '../../components/shared/StatusBadge';

export default function Reports() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedShop, setSelectedShop] = useState('all');

  const bookings = getBookings();
  const shops = getShops();

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    let match = true;

    if (startDate && booking.date < startDate) match = false;
    if (endDate && booking.date > endDate) match = false;
    if (selectedShop !== 'all' && booking.shopId !== selectedShop) match = false;

    return match;
  });

  // Calculate statistics
  const totalBookings = filteredBookings.length;
  const totalRation = filteredBookings.reduce(
    (acc, booking) => ({
      rice: acc.rice + booking.entitlement.rice,
      wheat: acc.wheat + booking.entitlement.wheat,
      sugar: acc.sugar + booking.entitlement.sugar,
      kerosene: acc.kerosene + booking.entitlement.kerosene,
    }),
    { rice: 0, wheat: 0, sugar: 0, kerosene: 0 }
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Reports & Analytics
              </h1>
              <p className="text-gray-600">
                Generate and download booking reports
              </p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Filter Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shop">Shop</Label>
                    <Select value={selectedShop} onValueChange={setSelectedShop}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Shops</SelectItem>
                        {shops.map((shop) => (
                          <SelectItem key={shop.id} value={shop.id}>
                            {shop.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                      setSelectedShop('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                  <Button className="gap-2">
                    <Download className="h-4 w-4" />
                    Export to CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-gray-900">
                    {totalBookings}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Rice Distributed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-blue-600">
                    {totalRation.rice} kg
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Wheat Distributed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-green-600">
                    {totalRation.wheat} kg
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sugar Distributed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-yellow-600">
                    {totalRation.sugar} kg
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredBookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking ID</TableHead>
                          <TableHead>Beneficiary</TableHead>
                          <TableHead>Shop</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time Slot</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Rice</TableHead>
                          <TableHead>Wheat</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-mono text-sm">
                              {booking.id}
                            </TableCell>
                            <TableCell>{booking.beneficiaryName}</TableCell>
                            <TableCell className="text-sm">
                              {booking.shopName}
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(booking.date).toLocaleDateString('en-IN')}
                            </TableCell>
                            <TableCell className="text-sm">
                              {booking.timeSlot}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={booking.status} />
                            </TableCell>
                            <TableCell>{booking.entitlement.rice} kg</TableCell>
                            <TableCell>{booking.entitlement.wheat} kg</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No bookings found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your filters to see more results
                    </p>
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
