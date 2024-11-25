"use client"

import { useEffect, useState } from 'react'
import { useAuthContext } from '@/components/AuthProvider'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateProfile } from 'firebase/auth'
import { db, auth } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

interface UserSettings {
  displayName: string;
  email: string;
  notifications: boolean;
  // Add more settings as needed
}

export default function SettingsPage() {
  const { user } = useAuthContext()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      fetchUserSettings();
    }
  }, [user]);

  const fetchUserSettings = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user!.uid));
      if (userDoc.exists()) {
        setSettings(userDoc.data() as UserSettings);
      } else {
        // Initialize default settings
        setSettings({
          displayName: user!.displayName || '',
          email: user!.email || '',
          notifications: true,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser!, {
        displayName: settings?.displayName,
      });

      // Update Firestore settings
      await updateDoc(doc(db, 'users', user.uid), {
        ...settings,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <div>Please log in to view settings</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-900">Display Name</label>
              <Input
                value={settings?.displayName}
                onChange={(e) => setSettings(prev => ({ ...prev!, displayName: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900">Email</label>
              <Input
                value={settings?.email}
                disabled
                className="mt-1"
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}