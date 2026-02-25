import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { bookingService } from '../../../api/booking.service';
import { shopService } from '../../../api/shop.service';
import { Navbar } from '../../components/shared/Navbar';
import { Sidebar } from '../../components/shared/Sidebar';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Booking, Shop } from '../../types';

export default function Reports() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedShop, setSelectedShop] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsData, shopsData] = await Promise.all([
          bookingService.getAllBookings(),
          shopService.getAllShops(),
        ]);
        setBookings(bookingsData);
        setShops(shopsData);
      } catch (error) {
        console.error('Failed to load report data:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    let match = true;
    if (startDate && booking.date < startDate) match = false;
    if (endDate && booking.date > endDate) match = false;
    if (selectedShop !== 'all' && booking.shopId !== selectedShop) match = false;
    return match;
  });

  // Summary stats
  const totalBookings = filteredBookings.length;
  const totalRation = filteredBookings.reduce(
    (acc, booking) => ({
      rice: acc.rice + (booking.entitlement?.rice ?? 0),
      wheat: acc.wheat + (booking.entitlement?.wheat ?? 0),
      sugar: acc.sugar + (booking.entitlement?.sugar ?? 0),
      kerosene: acc.kerosene + (booking.entitlement?.kerosene ?? 0),
    }),
    { rice: 0, wheat: 0, sugar: 0, kerosene: 0 }
  );

  const handleExportCSV = () => {
    if (filteredBookings.length === 0) return;
    const headers = ['Booking ID', 'Beneficiary', 'Shop', 'Date', 'Time Slot', 'Status', 'Rice (kg)', 'Wheat (kg)', 'Sugar (kg)', 'Kerosene (L)'];
    const rows = filteredBookings.map((b) => [
      b._id || b.id,
      b.beneficiaryName,
      b.shopName,
      b.date,
      b.timeSlot,
      b.status,
      b.entitlement?.rice ?? 0,
      b.entitlement?.wheat ?? 0,
      b.entitlement?.sugar ?? 0,
      b.entitlement?.kerosene ?? 0,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pds-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">Reports & Analytics</h1>
              <p className="text-gray-600">Generate and download booking reports</p>
            </div>

            {/* Filters */}
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
                    <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Shop</Label>
                    <Select value={selectedShop} onValueChange={setSelectedShop}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Shops</SelectItem>
                        {shops.map((shop) => {
                          const id = (shop._id || shop.id)!;
                          return <SelectItem key={id} value={id}>{shop.name}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <Button variant="outline" onClick={() => { setStartDate(''); setEndDate(''); setSelectedShop('all'); }}>
                    Clear Filters
                  </Button>
                  <Button className="gap-2" onClick={handleExportCSV} disabled={filteredBookings.length === 0}>
                    <Download className="h-4 w-4" />
                    Export to CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader><CardTitle className="text-sm">Total Bookings</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-semibold text-gray-900">{totalBookings}</p></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm">Rice Distributed</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-semibold text-blue-600">{totalRation.rice} kg</p></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm">Wheat Distributed</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-semibold text-green-600">{totalRation.wheat} kg</p></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm">Sugar Distributed</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-semibold text-yellow-600">{totalRation.sugar} kg</p></CardContent>
              </Card>
            </div>

            {/* Booking Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Booking Details ({filteredBookings.length})
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
                        {filteredBookings.map((booking) => {
                          const bookingId = (booking._id || booking.id)!;
                          return (
                            <TableRow key={bookingId}>
                              <TableCell className="font-mono text-xs">{bookingId}</TableCell>
                              <TableCell>{booking.beneficiaryName}</TableCell>
                              <TableCell className="text-sm">{booking.shopName}</TableCell>
                              <TableCell className="text-sm">{new Date(booking.date).toLocaleDateString('en-IN')}</TableCell>
                              <TableCell className="text-sm">{booking.timeSlot}</TableCell>
                              <TableCell><StatusBadge status={booking.status} /></TableCell>
                              <TableCell>{booking.entitlement?.rice ?? 0} kg</TableCell>
                              <TableCell>{booking.entitlement?.wheat ?? 0} kg</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-gray-600">Try adjusting your filters to see more results</p>
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
