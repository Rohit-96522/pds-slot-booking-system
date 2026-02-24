# PDS Slot Booking System

A comprehensive web application for managing ration distribution through fair price shops in India's Public Distribution System (PDS).

## Features

### 🔐 Three User Roles

1. **Admin** - System administrator
2. **Shopkeeper** - Fair price shop operators
3. **Beneficiary** - Ration card holders

### 📋 Functionality by Role

#### Admin Features
- View system-wide dashboard with statistics
- Approve or reject shop registrations
- Manage stock allocation to shops
- User management (CRUD operations)
- Generate reports with filters

#### Shopkeeper Features
- View shop approval status
- Create and manage time slots
- Set per-slot stock limits
- Track stock levels
- Verify beneficiary bookings using QR codes

#### Beneficiary Features
- Browse approved shops
- View real-time stock availability
- Book slots through 3-step process
- View auto-calculated ration entitlement
- Access QR codes for bookings
- Track booking history

## Demo Credentials

Use these credentials to test different user roles:

```
Admin:
Email: admin@pds.gov.in
Password: (any)

Shopkeeper:
Email: rajesh@shop.com
Password: (any)

Beneficiary:
Email: priya@example.com
Password: (any)
```

## User Flows

### Beneficiary Flow
1. Login/Register as beneficiary
2. Browse approved shops on home page
3. View shop details and stock availability
4. Book a slot (3 steps):
   - Select date
   - Select time slot
   - Confirm booking with entitlement preview
5. View booking confirmation with QR code
6. Access booking history with expandable QR codes

### Shopkeeper Flow
1. Login/Register as shopkeeper
2. View dashboard (status, stock, bookings)
3. Create slots with stock limits
4. Monitor stock overview
5. Verify beneficiary bookings by scanning QR codes

### Admin Flow
1. Login as admin
2. View system dashboard
3. Approve/reject shop registrations
4. Allocate stock to approved shops
5. Manage users
6. Generate and filter reports

## Technical Stack

- **Frontend**: React with TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **QR Codes**: qrcode.react
- **Animations**: Motion (Framer Motion)
- **Forms**: React Hook Form
- **State Management**: LocalStorage (demo mode)

## Design Highlights

- Clean, government portal aesthetic
- Blue primary color with green accents
- Mobile responsive layout
- Role-based navigation
- Professional typography
- Accessible components

## Getting Started

The application uses localStorage for demo purposes, so all data is stored locally in your browser. The system is initialized with sample data on first load.

### Registration

New users can register as:
- **Beneficiary**: Requires ration card number and family size
- **Shopkeeper**: Requires shop name, address, and optional image

Shopkeeper registrations require admin approval before the shop becomes active.

## Data Flow

1. **Booking Process**: When a beneficiary books a slot, the system:
   - Calculates entitlement based on family size
   - Checks stock availability
   - Generates unique booking ID and QR code
   - Updates slot availability
   - Deducts allocated stock

2. **Stock Management**: Admin allocates stock to shops, which shopkeepers distribute across time slots

3. **Verification**: Shopkeepers scan QR codes to verify bookings and dispense rations

## Notes

- Password validation is simplified for demo purposes
- QR scanning shows a placeholder (actual camera integration would require additional permissions)
- All data resets when localStorage is cleared
- Stock calculations are based on standard PDS allocations per family member

---

**Built with ❤️ for public service delivery**
