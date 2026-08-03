
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db as firestore } from '../firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, PlusCircle, Pencil, Trash } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const NewsManagement = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [form, setForm] = useState({ title: '', excerpt: '', videoUrl: '' });
    const [editingId, setEditingId] = useState(null);

    const newsCollection = collection(firestore, 'news');

    const fetchNews = async () => {
        setLoading(true);
        const newsSnapshot = await getDocs(newsCollection);
        const newsList = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.date.seconds - a.date.seconds);
        setNews(newsList);
        setLoading(false);
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            const docRef = doc(firestore, 'news', editingId);
            await updateDoc(docRef, form);
            setEditingId(null);
        } else {
            await addDoc(newsCollection, { ...form, date: new Date() });
        }
        setForm({ title: '', excerpt: '', videoUrl: '' });
        setIsFormOpen(false);
        fetchNews(); // Refresh the list
    };

    const handleEdit = (item) => {
        setForm({ title: item.title, excerpt: item.excerpt, videoUrl: item.videoUrl });
        setEditingId(item.id);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this news item?")) {
            const docRef = doc(firestore, 'news', id);
            await deleteDoc(docRef);
            fetchNews(); // Refresh the list
        }
    };
    
    const handleCancel = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setForm({ title: '', excerpt: '', videoUrl: '' });
    };

    if (loading) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" size={32} /></div>;
    }

    if (isFormOpen) {
        return (
            <div>
                <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit' : 'Add'} News Item</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="title" value={form.title} onChange={handleInputChange} placeholder="Title" required />
                    <Textarea name="excerpt" value={form.excerpt} onChange={handleInputChange} placeholder="Excerpt (short summary)" required />
                    <Input name="videoUrl" value={form.videoUrl} onChange={handleInputChange} placeholder="Video URL (e.g., Dropbox, Facebook, Instagram)" required />
                    <div className="flex gap-2">
                        <Button type="submit">{editingId ? 'Update' : 'Add'} News</Button>
                        <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">News Items</h3>
                <Button onClick={() => setIsFormOpen(true)}>
                    <PlusCircle className="mr-2" size={16} />
                    Add News Item
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map(item => (
                    <Card key={item.id}>
                        <CardContent className="p-4">
                             <div className="aspect-video bg-muted rounded-md mb-4 overflow-hidden">
                                <video
                                  src={item.videoUrl}
                                  className="w-full h-full object-cover"
                                  playsInline
                                  muted
                                  loop
                                />
                             </div>
                            <h4 className="font-bold mb-2">{item.title}</h4>
                            <p className="text-muted-foreground text-sm mb-4">{item.excerpt}</p>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                                    <Pencil size={14} />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                                    <Trash size={14} />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default NewsManagement;
