
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Textarea } from './ui/textarea';
import { Loader2 } from 'lucide-react';

const HomePageForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroCtaText: '',
  });
  const [loading, setLoading] = useState(true);
  const homePageDocRef = doc(db, 'siteContent', 'homePage');

  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(homePageDocRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      } else {
        // Initialize with default values if the document doesn't exist
        setFormData({
            heroTitle: "Innovative, Affordable, Unique Design Solutions",
            heroSubtitle: "We transform your vision into stunning reality. From web design to branding, we do it all with passion.",
            heroCtaText: "Our Services",
        });
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await setDoc(homePageDocRef, formData, { merge: true });
    setLoading(false);
    onSave();
  };

  if (loading && !formData.heroTitle) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Home Page Content</CardTitle>
        <CardDescription>Manage the hero section, featured content, and calls to action.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Textarea id="heroTitle" value={formData.heroTitle} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Textarea id="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroCtaText">Hero Button Text</Label>
            <Input id="heroCtaText" value={formData.heroCtaText} onChange={handleChange} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default HomePageForm;
