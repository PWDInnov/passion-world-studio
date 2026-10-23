import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  ExternalLink, 
  Image as ImageIcon,
  Tag,
  CheckCircle2,
  Megaphone
} from 'lucide-react';
import { AdvertPost, AdvertBadgeColor, calculatePresetEndDate, getAdvertRemainingTime } from '@/types/advert';

interface AdvertFormProps {
  item: AdvertPost | null;
  onSave: (ad: Omit<AdvertPost, 'id'> | AdvertPost) => Promise<void>;
  onCancel: () => void;
}

const PRESET_IMAGES = [
  {
    label: 'Branding & Identity',
    url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Mobile App Mockup',
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'UI/UX Diagnostic',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Fast-Track Tech Sprint',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  },
];

export const AdvertForm: React.FC<AdvertFormProps> = ({ item, onSave, onCancel }) => {
  const [title, setTitle] = useState(item?.title || '');
  const [subtitle, setSubtitle] = useState(item?.subtitle || '');
  const [details, setDetails] = useState(item?.details || '');
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [badgeText, setBadgeText] = useState(item?.badgeText || 'SPECIAL OFFER');
  const [badgeColor, setBadgeColor] = useState<AdvertBadgeColor>(item?.badgeColor || 'gold');
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || PRESET_IMAGES[0].url);
  const [ctaText, setCtaText] = useState(item?.ctaText || '');
  const [ctaLink, setCtaLink] = useState(item?.ctaLink || '');
  const [secondaryCtaText, setSecondaryCtaText] = useState(item?.secondaryCtaText || '');
  const [secondaryCtaLink, setSecondaryCtaLink] = useState(item?.secondaryCtaLink || '');
  
  const [durationPreset, setDurationPreset] = useState<'1w' | '2w' | '3w' | '4w' | 'custom' | 'permanent'>(
    item?.durationPreset || '2w'
  );

  const [startDate, setStartDate] = useState(
    item?.startDate ? item.startDate.slice(0, 10) : new Date().toISOString().slice(0, 10)
  );

  const [endDate, setEndDate] = useState(
    item?.endDate ? item.endDate.slice(0, 10) : calculatePresetEndDate('2w').slice(0, 10)
  );

  const [isActive, setIsActive] = useState(item?.isActive ?? true);
  const [priority, setPriority] = useState<number>(item?.priority ?? 10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePresetChange = (preset: '1w' | '2w' | '3w' | '4w' | 'custom' | 'permanent') => {
    setDurationPreset(preset);
    if (preset === 'permanent') {
      setEndDate('');
    } else if (preset === 'custom') {
      // Keep existing custom date or set to 1 week from start
      if (!endDate) {
        setEndDate(calculatePresetEndDate('1w', new Date(startDate)).slice(0, 10));
      }
    } else {
      const calculated = calculatePresetEndDate(preset, new Date(startDate));
      setEndDate(calculated.slice(0, 10));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: Omit<AdvertPost, 'id'> = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        details: details.trim() || undefined,
        badgeText: badgeText.trim() || 'PROMOTION',
        badgeColor,
        imageUrl: imageUrl.trim() || undefined,
        ctaText: ctaText.trim() || undefined, // Optional!
        ctaLink: ctaLink.trim() || undefined, // Optional!
        secondaryCtaText: secondaryCtaText.trim() || undefined,
        secondaryCtaLink: secondaryCtaLink.trim() || undefined,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(`${endDate}T23:59:59.999Z`).toISOString() : undefined,
        durationPreset,
        isActive,
        priority: Number(priority) || 0,
        createdAt: item?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (item?.id) {
        await onSave({ ...payload, id: item.id });
      } else {
        await onSave(payload);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewTime = getAdvertRemainingTime(endDate ? `${endDate}T23:59:59.999Z` : undefined);

  return (
    <Card className="border-amber-500/30 bg-card shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="text-amber-500" size={20} />
          <span>{item ? 'Edit Advert Posting' : 'Create New Advert Posting'}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure an interactive foreground promotional advert to appear on the homepage with an automated run schedule.
        </p>
      </CardHeader>
      <CardContent>
        {/* Live Advert Preview */}
        <div className="mb-8 p-4 rounded-xl bg-zinc-950 border border-amber-500/30 text-white shadow-inner">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-mono">
            <span>LIVE HOMEPAGE FOREGROUND PREVIEW</span>
            <span className="flex items-center gap-1 text-amber-400">
              <Sparkles size={12} />
              {isActive ? 'Preview (Will Show)' : 'Preview (Currently Inactive)'}
            </span>
          </div>

          <div className="flex justify-center py-2">
            <div className="w-full max-w-sm rounded-2xl border border-amber-500/40 bg-zinc-900/90 backdrop-blur-xl shadow-2xl overflow-hidden p-3.5 space-y-3">
              {/* Image thumbnail / banner */}
              {imageUrl && (
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-black/50 border border-white/10">
                  <img 
                    src={imageUrl} 
                    alt="Ad preview" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide border uppercase backdrop-blur-md ${
                      badgeColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                      badgeColor === 'crimson' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                      badgeColor === 'indigo' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' :
                      badgeColor === 'purple' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                      'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      <Tag size={9} />
                      {badgeText || 'SPECIAL OFFER'}
                    </span>
                    {!previewTime.isPermanent && (
                      <span className="text-[10px] text-amber-200 bg-black/80 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1 font-semibold">
                        <Clock size={10} className="text-amber-400" />
                        {previewTime.label}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Text */}
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                  {title || 'Your Advert Headline Here'}
                </h4>
                <p className={`text-xs text-zinc-300 leading-relaxed ${isPreviewExpanded ? '' : 'line-clamp-2'}`}>
                  {subtitle || 'Your compelling ad copy and promotional value proposition.'}
                </p>

                {/* Extended Preview details */}
                {isPreviewExpanded && (
                  <div className="p-2 rounded bg-black/60 border border-amber-500/20 text-[11px] text-zinc-200 mt-2 space-y-1">
                    <span className="font-semibold text-amber-400 block text-[10px] uppercase">Full Information:</span>
                    <p className="whitespace-pre-line">{details || 'Additional terms, full offer breakdown, and bullet points will appear here.'}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                  className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 pt-1 block"
                >
                  {isPreviewExpanded ? 'Show Less ▴' : 'View More Details ▾'}
                </button>
              </div>

              {/* CTA Button (only if text & link are set) */}
              <div className="pt-1">
                {ctaText && ctaLink ? (
                  <Button size="sm" className="w-full h-8 text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 btn-gold-shine">
                    {ctaText}
                  </Button>
                ) : (
                  <div className="text-center py-1 text-[11px] text-zinc-400 italic bg-white/5 rounded border border-white/10">
                    Once-Off Notice (No Link)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Controls */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ad-title" className="font-semibold">
                Advert Headline / Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ad-title"
                placeholder="e.g. Q4 Brand & Mobile App Launch Bundle — 25% Off"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Subtitle / Marketing Pitch */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ad-subtitle" className="font-semibold">
                Short Pitch &amp; Summary <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="ad-subtitle"
                rows={2}
                placeholder="Brief summary displayed on the card..."
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                required
              />
            </div>

            {/* Full Extended Details (for View More expansion) */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ad-details" className="font-semibold flex items-center justify-between">
                <span>Extended Information &amp; Full Details (Optional)</span>
                <span className="text-xs text-muted-foreground font-normal">Displayed when user clicks &quot;View More Details&quot;</span>
              </Label>
              <Textarea
                id="ad-details"
                rows={3}
                placeholder="Detailed explanation, special terms, schedule specifics, WhatsApp contact, or list of deliverables..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            {/* Badge Text */}
            <div className="space-y-2">
              <Label htmlFor="ad-badge" className="font-semibold flex items-center gap-1.5">
                <Tag size={15} />
                Badge Label
              </Label>
              <Input
                id="ad-badge"
                placeholder="e.g. SPECIAL DEAL, 25% OFF, LIMITED RUN"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
              />
            </div>

            {/* Badge Color */}
            <div className="space-y-2">
              <Label className="font-semibold">Badge Color Theme</Label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'gold', label: 'Gold', bg: 'bg-amber-500/20 text-amber-400 border-amber-500' },
                  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500' },
                  { id: 'crimson', label: 'Crimson', bg: 'bg-rose-500/20 text-rose-400 border-rose-500' },
                  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500' },
                  { id: 'purple', label: 'Purple', bg: 'bg-purple-500/20 text-purple-400 border-purple-500' },
                ].map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setBadgeColor(color.id as AdvertBadgeColor)}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-md border text-center transition-all ${color.bg} ${
                      badgeColor === color.id ? 'ring-2 ring-primary ring-offset-1' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {color.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image URL & Presets */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ad-image" className="font-semibold flex items-center gap-1.5">
                <ImageIcon size={15} />
                Banner / Thumbnail Image URL
              </Label>
              <Input
                id="ad-image"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-muted-foreground">Quick Presets:</span>
                {PRESET_IMAGES.map((preset) => (
                  <Button
                    key={preset.label}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 text-[11px] px-2"
                    onClick={() => setImageUrl(preset.url)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Primary CTA (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="ad-cta-text" className="font-semibold flex items-center justify-between">
                <span>Primary Button Label</span>
                <span className="text-xs text-muted-foreground font-normal">Optional (leave blank if no button/link)</span>
              </Label>
              <Input
                id="ad-cta-text"
                placeholder="e.g. Claim 25% Off (leave empty for once-off notice)"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ad-cta-link" className="font-semibold flex items-center justify-between">
                <span>Primary Button Target Link</span>
                <span className="text-xs text-muted-foreground font-normal">Optional</span>
              </Label>
              <Input
                id="ad-cta-link"
                placeholder="e.g. /contact or external link (or leave empty)"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
              />
            </div>

            {/* Secondary CTA (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="ad-sec-text" className="font-semibold">
                Secondary Link Label (Optional)
              </Label>
              <Input
                id="ad-sec-text"
                placeholder="e.g. View Case Studies"
                value={secondaryCtaText}
                onChange={(e) => setSecondaryCtaText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ad-sec-link" className="font-semibold">
                Secondary Link Target (Optional)
              </Label>
              <Input
                id="ad-sec-link"
                placeholder="e.g. /testimonials"
                value={secondaryCtaLink}
                onChange={(e) => setSecondaryCtaLink(e.target.value)}
              />
            </div>

            {/* Active Period / Duration Settings */}
            <div className="space-y-3 md:col-span-2 p-4 rounded-lg border border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <Clock className="text-primary" size={18} />
                <h4 className="font-bold text-sm">Post Run Schedule &amp; Expiration Duration</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Select how long this advert should run on the homepage. After the period expires, it will automatically hide from the homepage foreground without touching any code.
              </p>

              {/* Preset buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { id: '1w', label: '1 Week' },
                  { id: '2w', label: '2 Weeks' },
                  { id: '3w', label: '3 Weeks' },
                  { id: '4w', label: '1 Month' },
                  { id: 'custom', label: 'Custom' },
                  { id: 'permanent', label: 'Always Active' },
                ].map((itemPreset) => (
                  <Button
                    key={itemPreset.id}
                    type="button"
                    variant={durationPreset === itemPreset.id ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                    onClick={() => handlePresetChange(itemPreset.id as '1w' | '2w' | '3w' | '4w' | 'custom' | 'permanent')}
                  >
                    {itemPreset.label}
                  </Button>
                ))}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <Label htmlFor="ad-start" className="text-xs text-muted-foreground">
                    Start Date
                  </Label>
                  <Input
                    id="ad-start"
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (durationPreset !== 'permanent' && durationPreset !== 'custom') {
                        setEndDate(calculatePresetEndDate(durationPreset, new Date(e.target.value)).slice(0, 10));
                      }
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ad-end" className="text-xs text-muted-foreground">
                    End Date (Automatic Expiration)
                  </Label>
                  <Input
                    id="ad-end"
                    type="date"
                    disabled={durationPreset === 'permanent'}
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setDurationPreset('custom');
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Status & Priority */}
            <div className="space-y-2">
              <Label htmlFor="ad-priority" className="font-semibold">
                Priority / Slide Order (Higher = First)
              </Label>
              <Input
                id="ad-priority"
                type="number"
                min="0"
                max="100"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value, 10) || 0)}
              />
            </div>

            <div className="space-y-2 flex flex-col justify-end">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <Label htmlFor="ad-active" className="font-bold cursor-pointer">
                    Publish Status
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {isActive ? 'Active (Will appear if within date window)' : 'Paused (Hidden)'}
                  </p>
                </div>
                <Switch
                  id="ad-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
              <CheckCircle2 size={16} className="mr-1.5" />
              {isSubmitting ? 'Saving...' : item ? 'Update Advert' : 'Publish Advert'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdvertForm;
