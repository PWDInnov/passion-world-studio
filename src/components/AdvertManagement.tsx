import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Megaphone, 
  PlusCircle, 
  Pencil, 
  Trash, 
  Clock, 
  Calendar, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AdvertPost, isAdvertActive, getAdvertRemainingTime } from '@/types/advert';
import { defaultAdvertPosts } from '@/data/advertPostsData';
import AdvertForm from './AdvertForm';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, deleteField } from 'firebase/firestore';
import { toast } from '@/components/ui/use-toast';

interface AdvertManagementProps {
  ads: AdvertPost[];
  setAds: React.Dispatch<React.SetStateAction<AdvertPost[]>>;
}

export const AdvertManagement: React.FC<AdvertManagementProps> = ({ ads, setAds }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<AdvertPost | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Stats calculation
  const totalCount = ads.length;
  const activeCount = ads.filter(isAdvertActive).length;
  const expiredCount = ads.filter((ad) => {
    const time = getAdvertRemainingTime(ad.endDate);
    return time.isExpired;
  }).length;

  const handleSaveAd = async (adData: Omit<AdvertPost, 'id'> | AdvertPost) => {
    try {
      if ('id' in adData && adData.id) {
        // Update existing document
        const adRef = doc(db, 'homepageAds', adData.id);
        const { id, ...dataToSave } = adData;

        // Firestore updateDoc strictly rejects 'undefined' values.
        // Convert any undefined field to deleteField() so optional fields are cleanly cleared out.
        const cleanUpdateData: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(dataToSave)) {
          if (value === undefined) {
            cleanUpdateData[key] = deleteField();
          } else {
            cleanUpdateData[key] = value;
          }
        }

        await updateDoc(adRef, cleanUpdateData);
        setAds((prev) => prev.map((item) => (item.id === id ? (adData as AdvertPost) : item)));
        toast({
          title: 'Advert Updated',
          description: `"${adData.title}" was updated successfully.`,
        });
      } else {
        // Create new document: omit keys with undefined values entirely
        const cleanAddData: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(adData)) {
          if (value !== undefined) {
            cleanAddData[key] = value;
          }
        }

        const docRef = await addDoc(collection(db, 'homepageAds'), cleanAddData);
        const newAd: AdvertPost = { ...(adData as Omit<AdvertPost, 'id'>), id: docRef.id };
        setAds((prev) => [newAd, ...prev]);
        toast({
          title: 'Advert Created',
          description: `"${adData.title}" is now published.`,
        });
      }
      setIsFormOpen(false);
      setSelectedAd(null);
    } catch (err: unknown) {
      console.error('Error saving advert:', err);
      toast({
        title: 'Save Failed',
        description: err instanceof Error ? err.message : 'Could not save advert to Firestore.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAd = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the advert "${title}"?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'homepageAds', id));
      setAds((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: 'Advert Deleted',
        description: 'Advert post removed from homepage rotation.',
      });
    } catch (err: unknown) {
      console.error('Error deleting advert:', err);
      toast({
        title: 'Delete Failed',
        description: err instanceof Error ? err.message : 'Could not delete advert from Firestore.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (ad: AdvertPost) => {
    try {
      const newStatus = !ad.isActive;
      await updateDoc(doc(db, 'homepageAds', ad.id), { isActive: newStatus, updatedAt: new Date().toISOString() });
      setAds((prev) => prev.map((item) => (item.id === ad.id ? { ...item, isActive: newStatus } : item)));
      toast({
        title: newStatus ? 'Advert Activated' : 'Advert Paused',
        description: `"${ad.title}" is now ${newStatus ? 'active' : 'paused'}.`,
      });
    } catch (err: unknown) {
      console.error('Error toggling advert:', err);
      toast({
        title: 'Update Failed',
        description: err instanceof Error ? err.message : 'Could not update status.',
        variant: 'destructive',
      });
    }
  };

  const handleExtendDuration = async (ad: AdvertPost, daysToAdd: number) => {
    try {
      const baseDate = ad.endDate ? new Date(ad.endDate) : new Date();
      // If already expired, start extension from now
      const effectiveBase = baseDate.getTime() < Date.now() ? new Date() : baseDate;
      const newEndDate = new Date(effectiveBase);
      newEndDate.setDate(newEndDate.getDate() + daysToAdd);
      const isoEnd = newEndDate.toISOString();

      await updateDoc(doc(db, 'homepageAds', ad.id), { 
        endDate: isoEnd, 
        isActive: true, // reactivate if was expired
        updatedAt: new Date().toISOString() 
      });

      setAds((prev) => prev.map((item) => (item.id === ad.id ? { ...item, endDate: isoEnd, isActive: true } : item)));
      
      toast({
        title: 'Duration Extended',
        description: `Extended "${ad.title}" by ${daysToAdd} days (runs through ${newEndDate.toLocaleDateString()}).`,
      });
    } catch (err: unknown) {
      console.error('Error extending advert duration:', err);
      toast({
        title: 'Extension Failed',
        description: err instanceof Error ? err.message : 'Could not extend duration.',
        variant: 'destructive',
      });
    }
  };

  const handleSeedDefaults = async () => {
    setIsSeeding(true);
    try {
      const colRef = collection(db, 'homepageAds');
      for (const item of defaultAdvertPosts) {
        const { id, ...data } = item;
        const seedPayload = {
          ...data,
          startDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        const cleanSeedData: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(seedPayload)) {
          if (value !== undefined) {
            cleanSeedData[key] = value;
          }
        }
        await addDoc(colRef, cleanSeedData);
      }

      const snapshot = await getDocs(colRef);
      const seeded = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as AdvertPost));
      setAds(seeded);

      toast({
        title: 'Sample Adverts Populated',
        description: 'Successfully added 3 sample advert postings to your Firestore database.',
      });
    } catch (err: unknown) {
      console.error('Error seeding adverts:', err);
      toast({
        title: 'Seeding Failed',
        description: err instanceof Error ? err.message : 'Could not seed defaults.',
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  if (isFormOpen) {
    return (
      <AdvertForm
        item={selectedAd}
        onSave={handleSaveAd}
        onCancel={() => {
          setIsFormOpen(false);
          setSelectedAd(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header controls & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Megaphone className="text-primary" size={22} />
            Homepage Adverts &amp; Promotional Postings
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage interactive ads that appear in the homepage foreground above the hero section. Adverts automatically cycle in a slideshow and expire after their configured duration.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {ads.length === 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSeedDefaults}
              disabled={isSeeding}
              className="border-amber-500/40 text-amber-500 hover:bg-amber-500/10"
            >
              <Sparkles size={14} className="mr-1.5" />
              {isSeeding ? 'Seeding...' : 'Seed Default Adverts'}
            </Button>
          )}

          <Button 
            onClick={() => {
              setSelectedAd(null);
              setIsFormOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <PlusCircle size={16} className="mr-1.5" />
            Add New Advert
          </Button>
        </div>
      </div>

      {/* Mini metrics bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Adverts</div>
          <div className="text-2xl font-bold mt-1">{totalCount}</div>
        </div>
        <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
          <div className="text-xs text-emerald-400 font-medium uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 size={12} />
            Currently Live
          </div>
          <div className="text-2xl font-bold mt-1 text-emerald-500">{activeCount}</div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
            <Clock size={12} />
            Expired / Paused
          </div>
          <div className="text-2xl font-bold mt-1 text-muted-foreground">
            {expiredCount} expired · {totalCount - activeCount - expiredCount} paused
          </div>
        </div>
      </div>

      {/* Adverts Cards List */}
      {ads.length === 0 ? (
        <Card className="border-dashed p-10 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Megaphone size={24} />
            </div>
            <h4 className="text-lg font-bold">No Adverts Currently Created</h4>
            <p className="text-sm text-muted-foreground">
              You have no active ad postings in your Firestore database. Click below to load 3 ready-to-run sample adverts with 1-week, 2-week, and 3-week durations!
            </p>
            <Button onClick={handleSeedDefaults} disabled={isSeeding} className="mt-2">
              <Sparkles size={16} className="mr-1.5" />
              {isSeeding ? 'Seeding...' : 'Populate Sample Adverts'}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ads.map((ad) => {
            const isCurrentlyActive = isAdvertActive(ad);
            const timeInfo = getAdvertRemainingTime(ad.endDate);
            const startDateStr = ad.startDate ? new Date(ad.startDate).toLocaleDateString() : 'Immediate';
            const endDateStr = ad.endDate ? new Date(ad.endDate).toLocaleDateString() : 'Permanent';

            return (
              <Card 
                key={ad.id} 
                className={`relative overflow-hidden transition-all ${
                  isCurrentlyActive 
                    ? 'border-amber-500/40 shadow-md bg-card' 
                    : 'border-border/60 opacity-80 bg-muted/20'
                }`}
              >
                <CardContent className="p-5 space-y-4">
                  {/* Top Header: Badge, Status, and Toggle */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-zinc-700 dark:text-zinc-300 border border-border">
                        ADVERT
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded border bg-primary/10 text-primary border-primary/20">
                        {ad.badgeText}
                      </span>
                      
                      {/* Active or Expired Pill */}
                      {isCurrentlyActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Live · {timeInfo.label}
                        </span>
                      ) : timeInfo.isExpired ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
                          <AlertCircle size={11} />
                          Expired
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          Paused
                        </span>
                      )}
                    </div>

                    {/* Quick Active Switch */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {ad.isActive ? 'Active' : 'Off'}
                      </span>
                      <Switch
                        checked={ad.isActive}
                        onCheckedChange={() => handleToggleActive(ad)}
                      />
                    </div>
                  </div>

                  {/* Body: Thumbnail & Details */}
                  <div className="flex gap-4 items-start">
                    {ad.imageUrl && (
                      <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted">
                        <img 
                          src={ad.imageUrl} 
                          alt={ad.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-bold text-base leading-snug line-clamp-2">
                        {ad.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {ad.subtitle}
                      </p>

                      {ad.ctaText && ad.ctaLink ? (
                        <div className="pt-1 flex items-center gap-2 text-xs text-primary font-medium">
                          <span>CTA: {ad.ctaText}</span>
                          <ArrowRight size={12} />
                          <span className="text-muted-foreground truncate max-w-[150px]">{ad.ctaLink}</span>
                        </div>
                      ) : (
                        <div className="pt-1 text-xs text-muted-foreground italic flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                          <span>Once-Off Notice (No destination link)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div className="p-2.5 rounded-md bg-muted/40 text-xs flex flex-wrap items-center justify-between gap-2 text-muted-foreground border border-border/50">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-primary" />
                      <span><strong>Run:</strong> {startDateStr} → {endDateStr}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-primary" />
                      <span>{timeInfo.label}</span>
                    </div>
                  </div>

                  {/* Bottom Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
                    {/* Quick Extend buttons */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground font-medium">Extend:</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px] px-2"
                        onClick={() => handleExtendDuration(ad, 7)}
                        title="Add 1 week to this campaign"
                      >
                        +1 Wk
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px] px-2"
                        onClick={() => handleExtendDuration(ad, 14)}
                        title="Add 2 weeks to this campaign"
                      >
                        +2 Wks
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px] px-2"
                        onClick={() => handleExtendDuration(ad, 21)}
                        title="Add 3 weeks to this campaign"
                      >
                        +3 Wks
                      </Button>
                    </div>

                    {/* Edit & Delete */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2.5 text-xs"
                        onClick={() => {
                          setSelectedAd(ad);
                          setIsFormOpen(true);
                        }}
                      >
                        <Pencil size={12} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7 px-2.5 text-xs"
                        onClick={() => handleDeleteAd(ad.id, ad.title)}
                      >
                        <Trash size={12} className="mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>

                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdvertManagement;
