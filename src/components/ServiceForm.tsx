import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { toast } from './ui/use-toast';
import * as Icons from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const iconNames = Object.keys(Icons).filter(key => typeof Icons[key] === 'object' && Icons[key].displayName);

const ServiceForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    subtitle: item?.subtitle || '',
    description: item?.description || '',
    icon: item?.icon || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleIconChange = (value) => {
    setFormData((prev) => ({ ...prev, icon: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (item) {
        // Update existing service
        const serviceRef = doc(db, 'services', item.id);
        await updateDoc(serviceRef, formData);
        toast({ title: 'Success', description: 'Service updated successfully.' });
      } else {
        // Add new service
        await addDoc(collection(db, 'services'), formData);
        toast({ title: 'Success', description: 'New service added successfully.' });
      }
      onSave();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({ title: 'Error', description: 'Failed to save service.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item ? 'Edit Service' : 'Add New Service'}</CardTitle>
        <CardDescription>Fill out the details for the service.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Service Title</Label>
            <Input id="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input id="subtitle" value={formData.subtitle} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Select onValueChange={handleIconChange} value={formData.icon}>
                <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                    {iconNames.map(iconName => {
                        const Icon = Icons[iconName];
                        return (
                            <SelectItem key={iconName} value={iconName}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Icon style={{ marginRight: '8px' }} />
                                    {iconName}
                                </div>
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {item ? 'Save Changes' : 'Add Service'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceForm;
