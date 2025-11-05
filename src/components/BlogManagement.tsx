
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, Edit, Trash, Loader2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const BlogManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    readTime: '',
    imageUrl: '',
    tags: '',
  });

  const seedBlogData = async () => {
    const postsCollection = collection(db, 'blog');
    const postsSnapshot = await getDocs(postsCollection);
    if (postsSnapshot.empty) {
        const dummyPosts = [
            {
              title: "10 Web Design Trends for 2025",
              excerpt: "Discover the latest design trends that will shape the digital landscape in the coming year.",
              content: "<p>This is the full content for the web design trends post. It can include various HTML elements like <strong>bold text</strong>, <em>italics</em>, and <a href='#'>links</a>.</p>",
              imageUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=500&fit=crop",
              author: "Sarah Johnson",
              date: new Date("2025-01-15").toISOString(),
              readTime: "5 min read",
              tags: ["Design", "Trends", "Web"],
            },
            {
              title: "The Importance of Brand Identity",
              excerpt: "Learn why a strong brand identity is crucial for business success and how to build one.",
              content: "<p>A strong brand identity is more than just a logo. This post explores the different components of a successful brand strategy.</p>",
              imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop",
              author: "Michael Chen",
              date: new Date("2025-01-12").toISOString(),
              readTime: "7 min read",
              tags: ["Branding", "Business", "Strategy"],
            },
            {
              title: "Responsive Design Best Practices",
              excerpt: "Essential tips and techniques for creating websites that look great on all devices.",
              content: "<p>With more users accessing the web on mobile devices than ever before, responsive design is no longer optional. Here are our top tips.</p>",
              imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=500&fit=crop",
              author: "Emily Rodriguez",
              date: new Date("2025-01-10").toISOString(),
              readTime: "6 min read",
              tags: ["Development", "Mobile", "UX"],
            },
        ];
      for (const post of dummyPosts) {
        await addDoc(postsCollection, post);
      }
      toast({ title: "Dummy blog posts have been added." });
    }
  };

  useEffect(() => {
    seedBlogData().then(() => fetchPosts());
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postsCollection = collection(db, 'blog');
      const postsSnapshot = await getDocs(postsCollection);
      const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsList);
    } catch (error) {
      toast({ title: "Error fetching posts", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const postData = { 
      ...formData, 
      tags: formData.tags.split(',').map(tag => tag.trim()),
      date: new Date(formData.date).toISOString(),
     };

    try {
      if (currentPost) { // Update
        const postDoc = doc(db, 'blog', currentPost.id);
        await updateDoc(postDoc, postData);
        toast({ title: "Post updated successfully!" });
      } else { // Create
        await addDoc(collection(db, 'blog'), postData);
        toast({ title: "Post created successfully!" });
      }
      fetchPosts();
      setIsDialogOpen(false);
      setCurrentPost(null);
    } catch (error) {
      toast({ title: "Operation failed", description: error.message, variant: "destructive" });
    }
  };

  const openDialogForCreate = () => {
    setCurrentPost(null);
    setFormData({ 
      title: '', 
      excerpt: '', 
      content: '', 
      author: 'Passion World', 
      date: new Date().toISOString().split('T')[0], 
      readTime: '5 min read', 
      imageUrl: '', 
      tags: '' 
    });
    setIsDialogOpen(true);
  };

  const openDialogForUpdate = (post) => {
    setCurrentPost(post);
    setFormData({ 
        ...post, 
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
        date: post.date ? new Date(post.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setIsDialogOpen(true);
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, 'blog', id));
        toast({ title: "Post deleted successfully!" });
        fetchPosts();
      } catch (error) {
        toast({ title: "Deletion failed", description: error.message, variant: "destructive" });
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Blog Posts</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialogForCreate}>
              <PlusCircle className="mr-2" size={18} />
              Add New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{currentPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[70vh] w-full">
                 <form onSubmit={handleFormSubmit} className="space-y-4 py-4 pr-6">
                    <Input name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} required />
                    <Textarea name="excerpt" placeholder="Excerpt" value={formData.excerpt} onChange={handleInputChange} required />
                    <Textarea name="content" placeholder="Content (HTML supported)" value={formData.content} onChange={handleInputChange} rows={10} required />
                    <Input name="author" placeholder="Author" value={formData.author} onChange={handleInputChange} required />
                    <Input name="readTime" placeholder="Read Time (e.g., 5 min read)" value={formData.readTime} onChange={handleInputChange} required />
                    <Input name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleInputChange} />
                    <Input name="tags" placeholder="Tags (comma-separated)" value={formData.tags} onChange={handleInputChange} />
                    <Input name="date" type="date" value={formData.date} onChange={handleInputChange} required />
                    <Button type="submit">{currentPost ? 'Update' : 'Create'}</Button>
                </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="flex items-center justify-between p-2 rounded-md border">
                <span>{post.title}</span>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openDialogForUpdate(post)}><Edit size={16} /></Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeletePost(post.id)}><Trash size={16} /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogManagement;
