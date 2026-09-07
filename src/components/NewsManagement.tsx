
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db as firestore } from '../firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, PlusCircle, Pencil, Trash, Image as ImageIcon, Video } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const NewsManagement = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [form, setForm] = useState({ title: '', excerpt: '', mediaUrl: '', mediaType: 'image' });
    const [editingId, setEditingId] = useState(null);

    const newsCollection = collection(firestore, 'news');

    const fetchNews = async () => {
        setLoading(true);
        const q = query(newsCollection, orderBy("date", "desc"));
        const newsSnapshot = await getDocs(q);
        const newsList = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    
    const handleMediaTypeChange = (value) => {
        setForm({ ...form, mediaType: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSave = {
            ...form,
            mediaUrl: form.mediaUrl || '', // ensure it's not null/undefined
            mediaType: form.mediaUrl ? form.mediaType : 'none', // if no url, no media type
        };

        if (editingId) {
            const docRef = doc(firestore, 'news', editingId);
            await updateDoc(docRef, dataToSave);
        } else {
            await addDoc(newsCollection, { ...dataToSave, date: serverTimestamp() });
        }
        handleCancel();
        fetchNews();
    };

    const handleEdit = (item) => {
        setForm({
            title: item.title || '',
            excerpt: item.excerpt || '',
            mediaUrl: item.mediaUrl || '',
            mediaType: item.mediaType || 'image',
        });
        setEditingId(item.id);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this news item?")) {
            await deleteDoc(doc(firestore, 'news', id));
            fetchNews();
        }
    };
    
    const handleCancel = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setForm({ title: '', excerpt: '', mediaUrl: '', mediaType: 'image' });
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
                    
                    <div className="p-4 border rounded-lg space-y-4">
                        <Label>Media (Optional)</Label>
                        <Input name="mediaUrl" value={form.mediaUrl} onChange={handleInputChange} placeholder="Image or Video URL" />
                        {form.mediaUrl && (
                            <RadioGroup value={form.mediaType} onValueChange={handleMediaTypeChange} className="flex items-center gap-4">
                                <Label htmlFor="media-image" className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="image" id="media-image" />Image</Label>
                                <Label htmlFor="media-video" className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="video" id="media-video" />Video</Label>
                            </RadioGroup>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit">{editingId ? 'Update News' : 'Add News'}</Button>
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
                <Button onClick={() => setIsFormOpen(true)}><PlusCircle className="mr-2" size={16} />Add News</Button>
            </div>
            {news.length === 0 ? (
                 <p className="text-muted-foreground text-center p-8">No news items yet. Click "Add News" to create one.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map(item => (
                        <Card key={item.id}>
                            <CardContent className="p-4">
                                {item.mediaUrl && (
                                    <div className="aspect-video bg-muted rounded-md mb-4 overflow-hidden flex items-center justify-center">
                                        {item.mediaType === 'image' ? (
                                            <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                                        ) : item.mediaType === 'video' ? (
                                            <video src={item.mediaUrl} className="w-full h-full object-cover" playsInline muted loop controls />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <ImageIcon size={40} />
                                                <p>Media</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <h4 className="font-bold mb-2">{item.title}</h4>
                                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{item.excerpt}</p>
                                <p className="text-xs text-muted-foreground mb-4">
                                    {item.date?.seconds ? new Date(item.date.seconds * 1000).toLocaleDateString() : 'Just now'}
                                </p>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="icon" onClick={() => handleEdit(item)}><Pencil size={14} /></Button>
                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}><Trash size={14} /></Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewsManagement;
