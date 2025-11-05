
import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const PortfolioForm = ({ item, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setDescription(item.description || '');
      setImageUrl(item.imageUrl || '');
      setCategory(item.category || '');
      setTags(Array.isArray(item.tags) ? item.tags.join(', ') : '');
    } else {
        setTitle('');
        setDescription('');
        setImageUrl('');
        setCategory('');
        setTags('');
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const portfolioData = {
            title,
            description,
            imageUrl,
            category,
            tags: tags.split(',').map(tag => tag.trim()),
        };

      const portfolioCollection = collection(db, 'portfolio');
      if (item) {
        const portfolioDoc = doc(db, 'portfolio', item.id);
        await updateDoc(portfolioDoc, portfolioData);
        toast({ title: "Portfolio item updated!" });
      } else {
        await addDoc(portfolioCollection, { ...portfolioData, createdAt: serverTimestamp() });
        toast({ title: "Portfolio item created!" });
      }
      onSave();
    } catch (error) {
        toast({ title: "An error occurred", description: error.message, variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg">
      <h3 className="text-lg font-bold">{item ? 'Edit' : 'Add'} Portfolio Item</h3>
      <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <Input placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
        <Select onValueChange={setCategory} value={category} required>
            <SelectTrigger>
                <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="web">Web Design</SelectItem>
                <SelectItem value="branding">Branding</SelectItem>
                <SelectItem value="mobile">Mobile Apps</SelectItem>
            </SelectContent>
        </Select>
      <Input placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default PortfolioForm;
