import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Store, Upload, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Textarea } from '../../components/ui/textarea';
import { authService } from '../../../api/auth.service';
import { toast } from 'sonner';
import LocationPicker from '../../components/LocationPicker';

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'beneficiary' | 'shopkeeper'>('beneficiary');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    cardNumber: '',
    familyMembers: '4',
    address: '',
    latitude: 0,
    longitude: 0,
    shopName: '',
    shopAddress: '',
    shopLat: 0,
    shopLng: 0,
    shopImage: '',
  });

  const handleBeneficiaryLocationSelect = (address: string, lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, address, latitude: lat, longitude: lng }));
  };

  const handleShopLocationSelect = (address: string, lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, shopAddress: address, shopLat: lat, shopLng: lng }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (role === 'beneficiary') {
        await authService.register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: 'beneficiary',
          cardNumber: formData.cardNumber,
          familyMembers: parseInt(formData.familyMembers),
          address: formData.address,
          latitude: formData.latitude,
          longitude: formData.longitude,
        });
        toast.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        await authService.register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: 'shopkeeper',
          shopName: formData.shopName,
          shopAddress: formData.shopAddress,
          shopLat: formData.shopLat,
          shopLng: formData.shopLng,
          shopImage: formData.shopImage,
        });
        toast.success('Registration successful! Your shop is pending approval.');
        navigate('/login');
      }
    } catch (error: any) {
      console.error(error);
      const message = error?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Store className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Register for PDS System</CardTitle>
          <CardDescription>
            Create your account to access ration booking services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label>Register as</Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as 'beneficiary' | 'shopkeeper')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beneficiary" id="beneficiary" />
                  <Label htmlFor="beneficiary" className="cursor-pointer">
                    Beneficiary (Ration Card Holder)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="shopkeeper" id="shopkeeper" />
                  <Label htmlFor="shopkeeper" className="cursor-pointer">
                    Shopkeeper (Fair Price Shop)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {role === 'beneficiary' ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Ration Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="Enter card number"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="familyMembers">Family Members *</Label>
                    <Input
                      id="familyMembers"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.familyMembers}
                      onChange={(e) => setFormData({ ...formData, familyMembers: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Your Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Click on the map below to auto-fill your address, or type manually"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pin Your Location on Map *</Label>
                  <LocationPicker onLocationSelect={handleBeneficiaryLocationSelect} />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shopName">Shop Name *</Label>
                  <Input
                    id="shopName"
                    placeholder="Fair Price Shop Name"
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopAddress">Shop Address *</Label>
                  <Textarea
                    id="shopAddress"
                    placeholder="Click on the map below to auto-fill the address, or type manually"
                    value={formData.shopAddress}
                    onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
                    required
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pin Shop Location on Map *</Label>
                  <LocationPicker onLocationSelect={handleShopLocationSelect} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopImage">Shop Image URL (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="shopImage"
                      placeholder="Enter image URL"
                      value={formData.shopImage}
                      onChange={(e) => setFormData({ ...formData, shopImage: e.target.value })}
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
