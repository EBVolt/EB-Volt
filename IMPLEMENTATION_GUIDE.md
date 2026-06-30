# EcoBelle Volt - Feature Implementation Guide

This guide provides complete templates and instructions for implementing the three remaining features:
1. Favorite Chargers Feature
2. Booking Confirmation Emails
3. Admin Dashboard

## 1. FAVORITE CHARGERS FEATURE

### Backend Router Endpoints (Add to `server/routers.ts`)

```typescript
// Add to chargers router
favorites: router({
  addFavorite: protectedProcedure
    .input(z.object({ stationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await addFavoriteCharger(ctx.user.id, input.stationId);
      return { success: true };
    }),

  removeFavorite: protectedProcedure
    .input(z.object({ stationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await removeFavoriteCharger(ctx.user.id, input.stationId);
      return { success: true };
    }),

  getFavorites: protectedProcedure.query(async ({ ctx }) => {
    const favorites = await getUserFavoriteChargers(ctx.user.id);
    return favorites;
  }),

  isFavorite: protectedProcedure
    .input(z.object({ stationId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await isFavoriteCharger(ctx.user.id, input.stationId);
    }),
}),
```

### Frontend Component (Create `client/src/components/FavoriteButton.tsx`)

```typescript
import { Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

interface FavoriteButtonProps {
  stationId: number;
  size?: number;
}

export function FavoriteButton({ stationId, size = 18 }: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(false);
  const { data: isFavorite } = trpc.chargers.favorites.isFavorite.useQuery({ stationId });
  const addFav = trpc.chargers.favorites.addFavorite.useMutation();
  const removeFav = trpc.chargers.favorites.removeFavorite.useMutation();

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isFavorite) {
        await removeFav.mutateAsync({ stationId });
        setIsFav(false);
        toast.success("Removed from favorites");
      } else {
        await addFav.mutateAsync({ stationId });
        setIsFav(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error("Failed to update favorite");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="transition-colors"
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        size={size}
        style={{
          color: isFavorite ? "oklch(0.65 0.18 50)" : "oklch(0.45 0.05 240)",
          fill: isFavorite ? "oklch(0.65 0.18 50)" : "none",
        }}
      />
    </button>
  );
}
```

### Integration Points

1. Add FavoriteButton to station cards in `FindCharger.tsx`
2. Create a "Favorites" tab in Account dashboard
3. Display favorite stations on Home page

---

## 2. BOOKING CONFIRMATION EMAILS

### Backend Email Service (Create `server/emailService.ts`)

```typescript
import { notifyOwner } from "./_core/notification";

interface BookingEmailData {
  userEmail: string;
  userName: string;
  stationName: string;
  reservationDate: Date;
  duration: number;
  amount: string;
  transactionId: string;
}

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  const emailContent = `
    <h2>Booking Confirmation</h2>
    <p>Hi ${data.userName},</p>
    <p>Your charging reservation has been confirmed!</p>
    
    <h3>Reservation Details</h3>
    <ul>
      <li><strong>Station:</strong> ${data.stationName}</li>
      <li><strong>Date:</strong> ${data.reservationDate.toLocaleDateString()}</li>
      <li><strong>Time:</strong> ${data.reservationDate.toLocaleTimeString()}</li>
      <li><strong>Duration:</strong> ${data.duration} minutes</li>
      <li><strong>Amount:</strong> GHS ${data.amount}</li>
      <li><strong>Transaction ID:</strong> ${data.transactionId}</li>
    </ul>
    
    <p>You can view and manage your reservation in your account dashboard.</p>
    <p>Thank you for choosing EcoBelle Volt!</p>
  `;

  // Send via Manus notification API
  await notifyOwner({
    title: `Booking Confirmation - ${data.stationName}`,
    content: emailContent,
  });
}

export async function sendRefundApprovedEmail(data: {
  userEmail: string;
  userName: string;
  amount: string;
  refundTransactionId: string;
}) {
  const emailContent = `
    <h2>Refund Approved</h2>
    <p>Hi ${data.userName},</p>
    <p>Your refund request has been approved!</p>
    <p><strong>Amount:</strong> GHS ${data.amount}</p>
    <p><strong>Refund Transaction ID:</strong> ${data.refundTransactionId}</p>
    <p>The funds will be transferred to your MTN MoMo account within 24-48 hours.</p>
  `;

  await notifyOwner({
    title: "Refund Approved",
    content: emailContent,
  });
}
```

### Integration in Reservation Router

```typescript
// In server/routers.ts - charging router
createReservation: protectedProcedure
  .input(z.object({
    stationId: z.number(),
    startTime: z.date(),
    duration: z.number(),
    amount: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    const reservation = await createReservation({
      userId: ctx.user.id,
      stationId: input.stationId,
      startTime: input.startTime,
      duration: input.duration,
      status: "confirmed",
    });

    // Send confirmation email
    await sendBookingConfirmationEmail({
      userEmail: ctx.user.email || "",
      userName: ctx.user.name || "User",
      stationName: "EB Volt Station", // Fetch actual name
      reservationDate: input.startTime,
      duration: input.duration,
      amount: input.amount,
      transactionId: `RES-${reservation.insertId}`,
    });

    return reservation;
  }),
```

---

## 3. ADMIN DASHBOARD

### Create Admin Dashboard Page (`client/src/pages/AdminDashboard.tsx`)

```typescript
import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle, CheckCircle, Clock, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch admin data
  const { data: stats } = trpc.admin.getStats.useQuery();
  const { data: refunds } = trpc.admin.getPendingRefunds.useQuery();
  const { data: analytics } = trpc.admin.getAnalytics.useQuery();

  if (user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.98 0.01 240)" }}>
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
          Admin Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<DollarSign />}
            title="Total Revenue"
            value={`GHS ${stats?.totalRevenue || 0}`}
            color="oklch(0.52 0.18 145)"
          />
          <StatCard
            icon={<CheckCircle />}
            title="Completed Bookings"
            value={stats?.completedBookings || 0}
            color="oklch(0.52 0.18 145)"
          />
          <StatCard
            icon={<Clock />}
            title="Pending Refunds"
            value={refunds?.length || 0}
            color="oklch(0.65 0.18 50)"
          />
          <StatCard
            icon={<AlertCircle />}
            title="Active Stations"
            value={stats?.activeStations || 0}
            color="oklch(0.52 0.18 145)"
          />
        </div>

        {/* Analytics Chart */}
        <div className="bg-white rounded-xl p-6 mb-8" style={{ border: "1px solid oklch(0.88 0.02 240)" }}>
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Monthly Revenue
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics}>
              <CartesianGrid stroke="oklch(0.88 0.02 240)" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="oklch(0.52 0.18 145)" />
              <Bar dataKey="bookings" fill="oklch(0.65 0.18 50)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pending Refunds Table */}
        <div className="bg-white rounded-xl p-6" style={{ border: "1px solid oklch(0.88 0.02 240)" }}>
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.25 0.08 240)" }}>
            Pending Refund Requests
          </h2>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid oklch(0.88 0.02 240)" }}>
                <th className="text-left py-3">User</th>
                <th className="text-left py-3">Amount</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {refunds?.map((refund: any) => (
                <RefundRow key={refund.id} refund={refund} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }: any) {
  return (
    <div className="bg-white rounded-xl p-6" style={{ border: `1px solid ${color}20` }}>
      <div className="flex items-center gap-4">
        <div style={{ color, fontSize: 24 }}>{icon}</div>
        <div>
          <p style={{ color: "oklch(0.45 0.05 240)" }}>{title}</p>
          <p className="text-2xl font-bold" style={{ color: "oklch(0.25 0.08 240)", fontFamily: "'Space Grotesk', sans-serif" }}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function RefundRow({ refund }: any) {
  const approveMutation = trpc.admin.approveRefund.useMutation();
  const rejectMutation = trpc.admin.rejectRefund.useMutation();

  return (
    <tr style={{ borderBottom: "1px solid oklch(0.88 0.02 240)" }}>
      <td className="py-3">{refund.userName}</td>
      <td className="py-3">GHS {refund.amount}</td>
      <td className="py-3">
        <span style={{ color: "oklch(0.65 0.18 50)" }}>Pending</span>
      </td>
      <td className="py-3 flex gap-2">
        <button
          onClick={() => approveMutation.mutate({ refundId: refund.id })}
          className="px-3 py-1 rounded text-sm"
          style={{ background: "oklch(0.52 0.18 145)", color: "white" }}
        >
          Approve
        </button>
        <button
          onClick={() => rejectMutation.mutate({ refundId: refund.id })}
          className="px-3 py-1 rounded text-sm"
          style={{ background: "oklch(0.88 0.02 240)", color: "oklch(0.25 0.08 240)" }}
        >
          Reject
        </button>
      </td>
    </tr>
  );
}
```

### Admin Router Endpoints (Add to `server/routers.ts`)

```typescript
admin: router({
  getStats: adminProcedure.query(async ({ ctx }) => {
    const { paymentTransactions, chargingReservations, chargingStations } = await import("../drizzle/schema");
    const db = await getDb();

    const totalRevenue = await db.select({ sum: sql`SUM(amount)` })
      .from(paymentTransactions)
      .where(eq(paymentTransactions.status, "completed"));

    const completedBookings = await db.select({ count: sql`COUNT(*)` })
      .from(chargingReservations)
      .where(eq(chargingReservations.status, "completed"));

    const activeStations = await db.select({ count: sql`COUNT(*)` })
      .from(chargingStations);

    return {
      totalRevenue: totalRevenue[0]?.sum || 0,
      completedBookings: completedBookings[0]?.count || 0,
      activeStations: activeStations[0]?.count || 0,
    };
  }),

  getPendingRefunds: adminProcedure.query(async ({ ctx }) => {
    const { refundRequests, users } = await import("../drizzle/schema");
    const db = await getDb();

    return db.select()
      .from(refundRequests)
      .where(eq(refundRequests.status, "pending"));
  }),

  approveRefund: adminProcedure
    .input(z.object({ refundId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await updateRefundStatus(input.refundId, "approved");
      return { success: true };
    }),

  rejectRefund: adminProcedure
    .input(z.object({ refundId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await updateRefundStatus(input.refundId, "rejected");
      return { success: true };
    }),
}),
```

### Add Admin Route to App.tsx

```typescript
import AdminDashboard from "./pages/AdminDashboard";

// In Router component
<Route path="/admin" component={AdminDashboard} />
```

---

## Implementation Checklist

- [ ] Add `adminProcedure` to `server/_core/trpc.ts`
- [ ] Implement favorite chargers router endpoints
- [ ] Create FavoriteButton component
- [ ] Add favorite button to station cards
- [ ] Create favorites tab in Account dashboard
- [ ] Implement email service functions
- [ ] Integrate email sending in reservation creation
- [ ] Create admin dashboard page
- [ ] Implement admin router endpoints
- [ ] Add admin route protection
- [ ] Test all features end-to-end
- [ ] Save checkpoint

---

## Next Steps

1. Copy the code templates above into your project
2. Run `pnpm db:push` to sync database changes
3. Test each feature individually
4. Save a checkpoint when all features are working
5. Deploy to production

For questions or issues, refer to the existing code patterns in the project.
