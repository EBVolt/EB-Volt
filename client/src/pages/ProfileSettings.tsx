import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function ProfileSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const showNotification = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      alert(`${title}\n${message}`);
    } else {
      alert(`${title}\n${message}`);
    }
  };

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: "",
  });

  // Notification preferences state
  const [preferences, setPreferences] = useState({
    emailBookingConfirmation: true,
    emailPaymentReceipt: true,
    emailRefundStatus: true,
    emailPromotions: false,
    smsBookingConfirmation: true,
    smsPaymentReceipt: true,
    smsRefundStatus: true,
    smsPromotions: false,
  });

  // Fetch notification preferences
  const { data: fetchedPreferences, isLoading: preferencesLoading } =
    trpc.account.getNotificationPreferences.useQuery();

  // Fetch profile data
  const { data: profileInfo, isLoading: profileLoading } =
    trpc.account.getProfile.useQuery();

  // Update mutations
  const updateProfileMutation = trpc.account.updateProfile.useMutation({
    onSuccess: () => {
      showNotification('Success', 'Profile updated successfully');
    },
    onError: (error) => {
      showNotification('Error', error.message || 'Failed to update profile', 'error');
    },
  });

  const updatePreferencesMutation =
    trpc.account.updateNotificationPreferences.useMutation({
      onSuccess: () => {
        showNotification('Success', 'Notification preferences updated');
      },
      onError: (error) => {
        showNotification('Error', error.message || 'Failed to update preferences', 'error');
      },
    });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateProfileMutation.mutateAsync(profileData);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      await updatePreferencesMutation.mutateAsync(preferences);
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading || preferencesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account and notification preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    placeholder="Enter your email"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleProfileChange}
                    placeholder="Enter your phone number"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Used for SMS notifications and booking confirmations
                  </p>
                </div>

                <Button
                  onClick={handleSaveProfile}
                  disabled={loading || updateProfileMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Choose which emails you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="emailBookingConfirmation"
                    checked={preferences.emailBookingConfirmation}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange(
                        "emailBookingConfirmation",
                        checked as boolean
                      )
                    }
                  />
                  <Label
                    htmlFor="emailBookingConfirmation"
                    className="cursor-pointer"
                  >
                    <span className="font-medium">Booking Confirmations</span>
                    <p className="text-sm text-gray-500">
                      Get confirmation when you make a reservation
                    </p>
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="emailPaymentReceipt"
                    checked={preferences.emailPaymentReceipt}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange(
                        "emailPaymentReceipt",
                        checked as boolean
                      )
                    }
                  />
                  <Label
                    htmlFor="emailPaymentReceipt"
                    className="cursor-pointer"
                  >
                    <span className="font-medium">Payment Receipts</span>
                    <p className="text-sm text-gray-500">
                      Receive receipts for your payments
                    </p>
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="emailRefundStatus"
                    checked={preferences.emailRefundStatus}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange(
                        "emailRefundStatus",
                        checked as boolean
                      )
                    }
                  />
                  <Label htmlFor="emailRefundStatus" className="cursor-pointer">
                    <span className="font-medium">Refund Status</span>
                    <p className="text-sm text-gray-500">
                      Get updates on your refund requests
                    </p>
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="emailPromotions"
                    checked={preferences.emailPromotions}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange("emailPromotions", checked as boolean)
                    }
                  />
                  <Label htmlFor="emailPromotions" className="cursor-pointer">
                    <span className="font-medium">Promotional Offers</span>
                    <p className="text-sm text-gray-500">
                      Receive special offers and promotions
                    </p>
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SMS Notifications</CardTitle>
                <CardDescription>
                  Choose which SMS messages you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="smsBookingConfirmation"
                    checked={preferences.smsBookingConfirmation}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange(
                        "smsBookingConfirmation",
                        checked as boolean
                      )
                    }
                  />
                  <Label
                    htmlFor="smsBookingConfirmation"
                    className="cursor-pointer"
                  >
                    <span className="font-medium">Booking Confirmations</span>
                    <p className="text-sm text-gray-500">
                      Get SMS confirmation when you make a reservation
                    </p>
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="smsPaymentReceipt"
                    checked={preferences.smsPaymentReceipt}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange(
                        "smsPaymentReceipt",
                        checked as boolean
                      )
                    }
                  />
                  <Label htmlFor="smsPaymentReceipt" className="cursor-pointer">
                    <span className="font-medium">Payment Receipts</span>
                    <p className="text-sm text-gray-500">
                      Receive SMS receipts for your payments
                    </p>
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="smsRefundStatus"
                    checked={preferences.smsRefundStatus}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange(
                        "smsRefundStatus",
                        checked as boolean
                      )
                    }
                  />
                  <Label htmlFor="smsRefundStatus" className="cursor-pointer">
                    <span className="font-medium">Refund Status</span>
                    <p className="text-sm text-gray-500">
                      Get SMS updates on your refund requests
                    </p>
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="smsPromotions"
                    checked={preferences.smsPromotions}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange("smsPromotions", checked as boolean)
                    }
                  />
                  <Label htmlFor="smsPromotions" className="cursor-pointer">
                    <span className="font-medium">Promotional Offers</span>
                    <p className="text-sm text-gray-500">
                      Receive SMS promotions and special offers
                    </p>
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSavePreferences}
              disabled={loading || updatePreferencesMutation.isPending}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {updatePreferencesMutation.isPending
                ? "Saving..."
                : "Save Preferences"}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
