import { Badge } from '../ui/badge';

interface StatusBadgeProps {
  status: 'approved' | 'pending' | 'rejected' | 'confirmed' | 'completed' | 'cancelled' | 'out-of-stock';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
    approved: { variant: 'default', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
    pending: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
    rejected: { variant: 'destructive', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
    confirmed: { variant: 'default', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
    completed: { variant: 'default', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
    cancelled: { variant: 'outline', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
    'out-of-stock': { variant: 'destructive', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  };

  const config = variants[status] || variants.pending;

  return (
    <Badge variant={config.variant} className={config.className}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
    </Badge>
  );
}
