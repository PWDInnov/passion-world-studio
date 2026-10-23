import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash, Newspaper, Calendar, Link as LinkIcon } from "lucide-react";

interface NewsItem {
  id?: string;
  title: string;
  content: string;
  date: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
}

const NewsManagement = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

  const fetchNews = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "news"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as NewsItem));
      setNews(list);
    } catch (err: unknown) {
      console.error("Error fetching news:", err);
      // Fallback without ordering
      const snapshot = await getDocs(collection(db, "news"));
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as NewsItem));
      setNews(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpenForm = (item?: NewsItem) => {
    if (item) {
      setEditingItem(item);
      setTitle(item.title || "");
      setContent(item.content || "");
      setMediaUrl(item.mediaUrl || "");
      setMediaType(item.mediaType || "image");
    } else {
      setEditingItem(null);
      setTitle("");
      setContent("");
      setMediaUrl("");
      setMediaType("image");
    }
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        content,
        mediaUrl: mediaUrl || "",
        mediaType,
        date: editingItem?.date || new Date().toISOString(),
        updatedAt: serverTimestamp(),
      };

      if (editingItem?.id) {
        await updateDoc(doc(db, "news", editingItem.id), payload);
        toast({ title: "News article updated!" });
      } else {
        await addDoc(collection(db, "news"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        toast({ title: "News article published!" });
      }

      setIsFormOpen(false);
      fetchNews();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save news article";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await deleteDoc(doc(db, "news", id));
      setNews((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "Article deleted" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete article";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">News &amp; Studio Announcements</h3>
          <p className="text-xs text-muted-foreground">Manage studio news, releases, and milestones.</p>
        </div>
        {!isFormOpen && (
          <Button onClick={() => handleOpenForm()}>
            <Plus className="w-4 h-4 mr-2" /> Add News Article
          </Button>
        )}
      </div>

      {isFormOpen ? (
        <form onSubmit={handleSave} className="p-6 border rounded-xl bg-card space-y-4">
          <h4 className="font-bold text-lg">{editingItem ? "Edit News" : "New Article"}</h4>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Title *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Article Content *</label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Media URL (Image / Video)</label>
              <Input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Media Type</label>
              <select
                className="w-full border rounded-md px-3 py-2 bg-background text-sm"
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as "image" | "video")}
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Article</Button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground col-span-3 text-center py-10">No news articles yet.</p>
          )}
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden border bg-card flex flex-col justify-between">
              <div>
                {item.mediaUrl && (
                  <div className="aspect-video bg-muted overflow-hidden">
                    {item.mediaType === "video" ? (
                      <video src={item.mediaUrl} className="w-full h-full object-cover" controls />
                    ) : (
                      <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-base mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">{item.content}</p>
                </CardContent>
              </div>

              <div className="p-4 pt-0 border-t flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleOpenForm(item)}>
                  <Pencil size={14} />
                </Button>
                {item.id && (
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id!)}>
                    <Trash size={14} />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsManagement;
