import React, { useState } from "react";
import { useConference } from "@/hooks/useConference";
import { useAuthContext } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AdminConference() {
  const { currentConference, setCurrentConference } = useConference();
  const { isAuthenticated } = useAuthContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    logoUrl: currentConference?.logoUrl || "",
    faviconUrl: currentConference?.faviconUrl || "",
    primaryColor: currentConference?.primaryColor || "",
    accentColor: currentConference?.accentColor || "",
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Admin - Conference Branding</CardTitle>
          </CardHeader>
          <p className="text-sm text-muted-foreground">You must be signed in to edit branding.</p>
        </Card>
      </div>
    );
  }

  if (!currentConference) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>No Conference Selected</CardTitle>
          </CardHeader>
          <p className="text-sm text-muted-foreground">Please select a conference first.</p>
        </Card>
      </div>
    );
  }

  const handleChange = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/conferences/${currentConference.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to update conference');
      const updated = await res.json();
      setCurrentConference(updated);
      toast({ title: 'Updated', description: 'Conference branding updated' });
    } catch (err) {
      toast({ title: 'Error', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 max-w-2xl">
        <CardHeader>
          <CardTitle>Conference Branding — {currentConference.name} {currentConference.year}</CardTitle>
        </CardHeader>

        <div className="mt-4 space-y-4">
          <label className="block">
            <div className="text-xs text-muted-foreground mb-1">Logo URL</div>
            <Input value={form.logoUrl} onChange={(e) => handleChange('logoUrl', e.target.value)} />
          </label>

          <label className="block">
            <div className="text-xs text-muted-foreground mb-1">Favicon URL</div>
            <Input value={form.faviconUrl} onChange={(e) => handleChange('faviconUrl', e.target.value)} />
          </label>

          <label className="block">
            <div className="text-xs text-muted-foreground mb-1">Primary Color (CSS hex)</div>
            <Input value={form.primaryColor} onChange={(e) => handleChange('primaryColor', e.target.value)} />
          </label>

          <label className="block">
            <div className="text-xs text-muted-foreground mb-1">Accent Color (CSS hex)</div>
            <Input value={form.accentColor} onChange={(e) => handleChange('accentColor', e.target.value)} />
          </label>

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
            <Button variant="outline" onClick={() => setForm({ logoUrl: '', faviconUrl: '', primaryColor: '', accentColor: '' })}>Reset</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
