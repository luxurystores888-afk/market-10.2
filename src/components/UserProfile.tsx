import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, CreditCard, Settings, 
  Edit, Save, X, Plus, Eye, EyeOff, LogOut, Shield,
  Bell, Globe, Moon, Sun, Palette, History, Trash2,
  Lock, Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from '../context/AuthContext';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { state, actions } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: state.user?.profile?.firstName || '',
    lastName: state.user?.profile?.lastName || '',
    email: state.user?.email || '',
    phone: state.user?.profile?.phone || '',
    dateOfBirth: state.user?.profile?.dateOfBirth || '',
  });

  // Address form state
  const [addressData, setAddressData] = useState({
    type: 'shipping' as 'shipping' | 'billing' | 'both',
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
    isDefault: false,
  });

  // Payment method form state
  const [paymentData, setPaymentData] = useState({
    type: 'crypto' as 'crypto' | 'card' | 'bank',
    name: '',
    details: {},
    isDefault: false,
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    theme: state.user?.profile?.preferences?.theme || 'cyberpunk' as 'cyberpunk' | 'dark' | 'light',
    language: state.user?.profile?.preferences?.language || 'en',
    currency: state.user?.profile?.preferences?.currency || 'USD',
    notifications: {
      email: state.user?.profile?.preferences?.notifications?.email !== undefined 
        ? state.user.profile.preferences.notifications.email : true,
      push: state.user?.profile?.preferences?.notifications?.push !== undefined 
        ? state.user.profile.preferences.notifications.push : true,
      sms: state.user?.profile?.preferences?.notifications?.sms !== undefined 
        ? state.user.profile.preferences.notifications.sms : false,
    }
  });

  if (!isOpen || !state.user) return null;

  const handleSaveProfile = async () => {
    try {
      await actions.updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        dateOfBirth: profileData.dateOfBirth,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleAddAddress = async () => {
    try {
      await actions.addAddress(addressData);
      setShowAddressForm(false);
      setAddressData({
        type: 'shipping',
        name: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
        phone: '',
        isDefault: false,
      });
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };

  const handleAddPaymentMethod = async () => {
    try {
      await actions.addPaymentMethod({
        type: paymentData.type,
        name: paymentData.name,
        details: paymentData.details,
        isDefault: paymentData.isDefault,
      });
      setShowPaymentForm(false);
      setPaymentData({
        type: 'crypto',
        name: '',
        details: {},
        isDefault: false,
      });
    } catch (error) {
      console.error('Failed to add payment method:', error);
    }
  };

  const handleUpdatePreferences = async () => {
    try {
      await actions.updateProfile({ preferences });
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  const handleLogout = () => {
    actions.logout();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed inset-4 bg-gray-900 border border-cyan-500/30 rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {state.user.name || state.user.email}
                </h2>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  {state.user.role}
                  {state.user.emailVerified && (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 text-xs">Verified</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-64 border-r border-gray-800 p-4">
                  <TabsList className="flex flex-col h-auto w-full bg-transparent">
                    <TabsTrigger 
                      value="profile" 
                      className="w-full justify-start data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger 
                      value="addresses" 
                      className="w-full justify-start data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
                    >
                      <MapPin className="w-4 h-4 mr-3" />
                      Addresses
                    </TabsTrigger>
                    <TabsTrigger 
                      value="payments" 
                      className="w-full justify-start data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
                    >
                      <CreditCard className="w-4 h-4 mr-3" />
                      Payment Methods
                    </TabsTrigger>
                    <TabsTrigger 
                      value="orders" 
                      className="w-full justify-start data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
                    >
                      <History className="w-4 h-4 mr-3" />
                      Order History
                    </TabsTrigger>
                    <TabsTrigger 
                      value="preferences" 
                      className="w-full justify-start data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Preferences
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="profile" className="p-6 space-y-6 m-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                      <Button
                        onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                        size="sm"
                        className="bg-cyan-500 hover:bg-cyan-600 text-white"
                      >
                        {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                        {isEditing ? 'Save' : 'Edit'}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">First Name</Label>
                        <Input
                          value={profileData.firstName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-gray-800/50 border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Last Name</Label>
                        <Input
                          value={profileData.lastName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-gray-800/50 border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Email</Label>
                        <Input
                          value={profileData.email}
                          disabled
                          className="bg-gray-800/30 border-gray-700 text-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Phone</Label>
                        <Input
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-gray-800/50 border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label className="text-gray-300">Date of Birth</Label>
                        <Input
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-gray-800/50 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="addresses" className="p-6 space-y-6 m-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Addresses</h3>
                      <Button
                        onClick={() => setShowAddressForm(true)}
                        size="sm"
                        className="bg-cyan-500 hover:bg-cyan-600 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Address
                      </Button>
                    </div>

                    {/* Address Form Modal */}
                    {showAddressForm && (
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center justify-between">
                            Add New Address
                            <Button
                              onClick={() => setShowAddressForm(false)}
                              variant="ghost"
                              size="sm"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-gray-300">Full Name</Label>
                              <Input
                                value={addressData.name}
                                onChange={(e) => setAddressData(prev => ({ ...prev, name: e.target.value }))}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-300">Type</Label>
                              <Select 
                                value={addressData.type} 
                                onValueChange={(value) => setAddressData(prev => ({ ...prev, type: value as any }))}
                              >
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="shipping">Shipping</SelectItem>
                                  <SelectItem value="billing">Billing</SelectItem>
                                  <SelectItem value="both">Both</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label className="text-gray-300">Address Line 1</Label>
                              <Input
                                value={addressData.addressLine1}
                                onChange={(e) => setAddressData(prev => ({ ...prev, addressLine1: e.target.value }))}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label className="text-gray-300">Address Line 2 (Optional)</Label>
                              <Input
                                value={addressData.addressLine2}
                                onChange={(e) => setAddressData(prev => ({ ...prev, addressLine2: e.target.value }))}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-300">City</Label>
                              <Input
                                value={addressData.city}
                                onChange={(e) => setAddressData(prev => ({ ...prev, city: e.target.value }))}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-300">State/Province</Label>
                              <Input
                                value={addressData.state}
                                onChange={(e) => setAddressData(prev => ({ ...prev, state: e.target.value }))}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-300">Postal Code</Label>
                              <Input
                                value={addressData.postalCode}
                                onChange={(e) => setAddressData(prev => ({ ...prev, postalCode: e.target.value }))}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-300">Country</Label>
                              <Select 
                                value={addressData.country} 
                                onValueChange={(value) => setAddressData(prev => ({ ...prev, country: value }))}
                              >
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="US">United States</SelectItem>
                                  <SelectItem value="CA">Canada</SelectItem>
                                  <SelectItem value="GB">United Kingdom</SelectItem>
                                  <SelectItem value="AU">Australia</SelectItem>
                                  <SelectItem value="DE">Germany</SelectItem>
                                  <SelectItem value="FR">France</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={addressData.isDefault}
                              onCheckedChange={(checked) => setAddressData(prev => ({ ...prev, isDefault: checked }))}
                            />
                            <Label className="text-gray-300">Set as default address</Label>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleAddAddress} className="flex-1 bg-cyan-500 hover:bg-cyan-600">
                              Save Address
                            </Button>
                            <Button 
                              onClick={() => setShowAddressForm(false)}
                              variant="outline"
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Address List */}
                    <div className="space-y-4">
                      {state.user.profile?.addresses?.map((address) => (
                        <Card key={address.id} className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium text-white">{address.name}</h4>
                                  <span className="text-xs px-2 py-1 rounded bg-cyan-500/20 text-cyan-400">
                                    {address.type}
                                  </span>
                                  {address.isDefault && (
                                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-300 text-sm">
                                  {address.addressLine1}
                                  {address.addressLine2 && `, ${address.addressLine2}`}
                                </p>
                                <p className="text-gray-300 text-sm">
                                  {address.city}, {address.state} {address.postalCode}
                                </p>
                                <p className="text-gray-400 text-sm">{address.country}</p>
                              </div>
                              <Button
                                onClick={() => actions.deleteAddress(address.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )) || (
                        <div className="text-center py-8 text-gray-400">
                          No addresses added yet. Click "Add Address" to get started.
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="payments" className="p-6 space-y-6 m-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
                      <Button
                        onClick={() => setShowPaymentForm(true)}
                        size="sm"
                        className="bg-cyan-500 hover:bg-cyan-600 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Payment Method
                      </Button>
                    </div>

                    {/* Payment Method List */}
                    <div className="space-y-4">
                      {state.user.profile?.paymentMethods?.map((method) => (
                        <Card key={method.id} className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-cyan-400" />
                                <div>
                                  <h4 className="font-medium text-white">{method.name}</h4>
                                  <p className="text-gray-400 text-sm">{method.type.toUpperCase()}</p>
                                </div>
                                {method.isDefault && (
                                  <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">
                                    Default
                                  </span>
                                )}
                              </div>
                              <Button
                                onClick={() => actions.deletePaymentMethod(method.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )) || (
                        <div className="text-center py-8 text-gray-400">
                          No payment methods added yet. Add crypto wallets or cards to get started.
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="orders" className="p-6 space-y-6 m-0">
                    <h3 className="text-lg font-semibold text-white">Order History</h3>
                    
                    <div className="text-center py-8 text-gray-400">
                      No orders found. Start shopping to see your order history here!
                    </div>
                  </TabsContent>

                  <TabsContent value="preferences" className="p-6 space-y-6 m-0">
                    <h3 className="text-lg font-semibold text-white">Preferences</h3>
                    
                    <div className="space-y-6">
                      {/* Theme Selection */}
                      <div>
                        <Label className="text-gray-300 text-base font-medium">Theme</Label>
                        <p className="text-gray-400 text-sm mb-3">Choose your preferred interface style</p>
                        <Select 
                          value={preferences.theme} 
                          onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value as any }))}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cyberpunk">🔮 Cyberpunk</SelectItem>
                            <SelectItem value="dark">🌙 Dark</SelectItem>
                            <SelectItem value="light">☀️ Light</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Language & Currency */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300 text-base font-medium">Language</Label>
                          <Select 
                            value={preferences.language} 
                            onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">🇺🇸 English</SelectItem>
                              <SelectItem value="es">🇪🇸 Español</SelectItem>
                              <SelectItem value="fr">🇫🇷 Français</SelectItem>
                              <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                              <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-300 text-base font-medium">Currency</Label>
                          <Select 
                            value={preferences.currency} 
                            onValueChange={(value) => setPreferences(prev => ({ ...prev, currency: value }))}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">💵 USD</SelectItem>
                              <SelectItem value="EUR">💶 EUR</SelectItem>
                              <SelectItem value="GBP">💷 GBP</SelectItem>
                              <SelectItem value="BTC">₿ Bitcoin</SelectItem>
                              <SelectItem value="ETH">⟠ Ethereum</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Notifications */}
                      <div>
                        <Label className="text-gray-300 text-base font-medium">Notifications</Label>
                        <p className="text-gray-400 text-sm mb-3">Choose how you want to be notified</p>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white">Email Notifications</p>
                              <p className="text-gray-400 text-sm">Order updates, promotions, and news</p>
                            </div>
                            <Switch
                              checked={preferences.notifications.email}
                              onCheckedChange={(checked) => 
                                setPreferences(prev => ({ 
                                  ...prev, 
                                  notifications: { ...prev.notifications, email: checked }
                                }))
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white">Push Notifications</p>
                              <p className="text-gray-400 text-sm">Browser notifications</p>
                            </div>
                            <Switch
                              checked={preferences.notifications.push}
                              onCheckedChange={(checked) => 
                                setPreferences(prev => ({ 
                                  ...prev, 
                                  notifications: { ...prev.notifications, push: checked }
                                }))
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white">SMS Notifications</p>
                              <p className="text-gray-400 text-sm">Text messages for critical updates</p>
                            </div>
                            <Switch
                              checked={preferences.notifications.sms}
                              onCheckedChange={(checked) => 
                                setPreferences(prev => ({ 
                                  ...prev, 
                                  notifications: { ...prev.notifications, sms: checked }
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={handleUpdatePreferences}
                        className="w-full bg-cyan-500 hover:bg-cyan-600"
                      >
                        Save Preferences
                      </Button>
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}