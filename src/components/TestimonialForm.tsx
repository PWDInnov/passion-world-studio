import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";

const TestimonialForm = ({ item, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setRole(item.role || '');
      setQuote(item.quote || '');
      setImageUrl(item.imageUrl || '');
      setRating(item.rating || 5);
    } else {
        setName('');
        setRole('');
        setQuote('');
        setImageUrl('');
        setRating(5);
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const testimonialData = {
            name,
            role,
            quote,
            imageUrl,
            rating: Number(rating),
        };

      if (item && item.id) {
        const testimonialDoc = doc(db, 'testimonials', item.id);
        await updateDoc(testimonialDoc, testimonialData);
        toast({ title: "Testimonial updated!" });
        onSave({ ...item, ...testimonialData });
      } else {
        const docRef = await addDoc(collection(db, 'testimonials'), { ...testimonialData, createdAt: serverTimestamp() });
        toast({ title: "Testimonial created!" });
        onSave({ ...testimonialData, id: docRef.id });
      }
    } catch (error) {
        toast({ title: "An error occurred", description: error.message, variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg">
      <h3 className="text-lg font-bold">{item ? 'Edit' : 'Add'} Testimonial</h3>
      <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input placeholder="Role (e.g., CEO, TechStart Inc)" value={role} onChange={(e) => setRole(e.target.value)} required />
      <Textarea placeholder="Quote" value={quote} onChange={(e) => setQuote(e.target.value)} required />
      <div className="space-y-2">
        <label htmlFor="testimonial-image-url" className="text-sm font-medium">Profile image URL</label>
        <Input
          id="testimonial-image-url"
          type="url"
          inputMode="url"
          placeholder="https://example.com/client-photo.jpg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Paste a direct image link from Dropbox, Facebook, or another image host.</p>
        {imageUrl && (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={imageUrl} alt="Profile preview" className="object-cover" />
              <AvatarFallback className="bg-gradient-gold text-white">
                {name ? name.split(' ').map((namePart) => namePart[0]).join('') : '?'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">Image preview</span>
          </div>
        )}
      </div>
      <Input type="number" placeholder="Rating (1-5)" value={rating} onChange={(e) => setRating(Number(e.target.value))} min="1" max="5" required />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default TestimonialForm;
