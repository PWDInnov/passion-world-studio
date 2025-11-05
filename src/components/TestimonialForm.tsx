
import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
      <Input placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      <Input type="number" placeholder="Rating (1-5)" value={rating} onChange={(e) => setRating(Number(e.target.value))} min="1" max="5" required />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default TestimonialForm;
