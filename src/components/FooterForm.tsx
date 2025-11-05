
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Textarea } from './ui/textarea';
import { Loader2 } from 'lucide-react';

const FooterForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const footerDocRef = doc(db, 'siteContent', 'footer');

  useEffect(() => {
    const fetchFooterData = async () => {
      const docSnap = await getDoc(footerDocRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      } else {
        // If the document doesn't exist, initialize with current static values
        setFormData({
            email: "info.passionworlddesigns@gmail.com",
            phone: "+1 (555) 123-4567",
            address: "123 Design Street, Creative City, CC 12345",
        });
      }
      setLoading(false);
    };

    fetchFooterData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await setDoc(footerDocRef, formData, { merge: true });
    setLoading(false);
    onSave();
  };

  if (loading && !formData.email) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Footer Content</CardTitle>
        <CardDescription>Update the contact information displayed in your site's footer.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input id="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, Anytown, USA" />
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

export default FooterForm;
