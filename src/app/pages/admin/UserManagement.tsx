import { useState, useEffect } from 'react';
import { Users, Trash2, Edit, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { userService } from '../../../api/user.service';
import { Navbar } from '../../components/shared/Navbar';
import { Sidebar } from '../../components/shared/Sidebar';
import { toast } from 'sonner';
import { User } from '../../types';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (error) {
        toast.error('Failed to load users');
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleDelete = async (user: User) => {
    const userId = (user._id || user.id)!;
    if (!confirm(`Are you sure you want to delete user: ${user.name}?`)) return;

    setDeletingId(userId);
    try {
      await userService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  const beneficiaries = users.filter((u) => u.role === 'beneficiary');
  const shopkeepers = users.filter((u) => u.role === 'shopkeeper');
  const admins = users.filter((u) => u.role === 'admin');

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
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">User Management</h1>
              <p className="text-gray-600">Manage all system users</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Beneficiaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-blue-600">{beneficiaries.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Shopkeepers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-green-600">{shopkeepers.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Admins</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-purple-600">{admins.length}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All Users ({users.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Card/Shop</TableHead>
                          <TableHead>Registered</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => {
                          const userId = (user._id || user.id)!;
                          const isDeleting = deletingId === userId;
                          return (
                            <TableRow key={userId}>
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.phone}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    user.role === 'admin'
                                      ? 'bg-purple-100 text-purple-800'
                                      : user.role === 'shopkeeper'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                                  }
                                >
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm font-mono">
                                {user.role === 'beneficiary' && (user.cardNumber || '—')}
                                {user.role === 'shopkeeper' && (user.shopId || '—')}
                                {user.role === 'admin' && '—'}
                              </TableCell>
                              <TableCell className="text-sm">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toast.info('Edit feature coming soon')}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(user)}
                                    disabled={user.role === 'admin' || isDeleting}
                                  >
                                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600">No users found</div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
