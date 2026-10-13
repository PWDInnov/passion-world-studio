import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, Edit, Trash, Loader2, FileText } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import RichTextEditor from './RichTextEditor';
import { seoArticleDrafts, seoTopicIdeas } from '@/data/seoArticleDrafts';
import type { BlogPost } from '@/types';

type ManagedBlogPost = BlogPost & { id: string; publishedAt?: string | null };

type BlogFormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
  imageAlt: string;
  tags: string;
  status: 'draft' | 'review' | 'published';
  metaTitle: string;
  metaDescription: string;
};

const emptyFormData: BlogFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: 'PassionWorld Designs',
  date: new Date().toISOString().split('T')[0],
  readTime: '5 min read',
  imageUrl: '',
  imageAlt: '',
  tags: '',
  status: 'draft',
  metaTitle: '',
  metaDescription: '',
};

const statusLabel = (status?: string) => {
  if (status === 'review') return 'In review';
  if (status === 'published' || !status) return 'Published';
  return 'Draft';
};

const BlogManagement = () => {
  const [posts, setPosts] = useState<ManagedBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<ManagedBlogPost | null>(null);
  const [formData, setFormData] = useState<BlogFormData>(emptyFormData);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postsSnapshot = await getDocs(collection(db, 'blog'));
      const postsList = postsSnapshot.docs
        .map((postDoc) => ({ id: postDoc.id, ...postDoc.data() } as ManagedBlogPost))
        .sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());
      setPosts(postsList);
    } catch (error: unknown) {
      toast({ title: "Error fetching posts", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const loadSeoDrafts = async () => {
    try {
      const postsSnapshot = await getDocs(collection(db, 'blog'));
      const existingTitles = new Set(postsSnapshot.docs.map((postDoc) => postDoc.data().title));
      const draftsToAdd = seoArticleDrafts.filter((draft) => !existingTitles.has(draft.title));

      for (const draft of draftsToAdd) {
        await addDoc(collection(db, 'blog'), draft);
      }

      toast({
        title: draftsToAdd.length ? `${draftsToAdd.length} SEO drafts added for review.` : "SEO drafts are already loaded.",
      });
      fetchPosts();
    } catch (error: unknown) {
      toast({ title: "Could not load SEO drafts", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleContentChange = (value: string) => {
    setFormData((previous) => ({ ...previous, content: value }));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const now = new Date().toISOString();
    const postData = {
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      date: new Date(formData.date).toISOString(),
      publishedAt: formData.status === 'published' ? (currentPost?.publishedAt || now) : null,
      updatedAt: now,
    };

    try {
      if (currentPost) {
        await updateDoc(doc(db, 'blog', currentPost.id), postData);
        toast({ title: "Post updated successfully!" });
      } else {
        await addDoc(collection(db, 'blog'), postData);
        toast({ title: "Post saved as a draft." });
      }
      await fetchPosts();
      setIsDialogOpen(false);
      setCurrentPost(null);
    } catch (error: unknown) {
      toast({ title: "Operation failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    }
  };

  const openDialogForCreate = () => {
    setCurrentPost(null);
    setFormData({ ...emptyFormData, date: new Date().toISOString().split('T')[0] });
    setIsDialogOpen(true);
  };

  const openDialogForUpdate = (post: ManagedBlogPost) => {
    setCurrentPost(post);
    setFormData({
      ...emptyFormData,
      ...post,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      date: post.date ? new Date(post.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      status: post.status || 'published',
    });
    setIsDialogOpen(true);
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, 'blog', id));
        toast({ title: "Post deleted successfully!" });
        fetchPosts();
      } catch (error: unknown) {
        toast({ title: "Deletion failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="text-primary" size={20} /> SEO Content Planner</CardTitle>
          <p className="text-sm text-muted-foreground">Use searched service topics to prepare useful articles. New drafts stay private until their status is changed to Published.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {seoTopicIdeas.map((topic) => (
              <div key={topic.title} className="rounded-lg border p-4">
                <p className="font-semibold">{topic.title}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary">{topic.service}</p>
                <p className="mt-2 text-sm text-muted-foreground">{topic.angle}</p>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" onClick={loadSeoDrafts}>
            <FileText className="mr-2" size={16} />
            Add prepared SEO drafts for review
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Blog Posts</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Review titles, SEO descriptions, content, and status before publishing.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openDialogForCreate}>
                <PlusCircle className="mr-2" size={18} />
                Add New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{currentPost ? 'Edit Post' : 'Create New Draft'}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[70vh] w-full">
                <form onSubmit={handleFormSubmit} className="space-y-4 py-4 pr-6">
                  <Input name="title" placeholder="Article title" value={formData.title} onChange={handleInputChange} required />
                  <Input name="slug" placeholder="URL slug, e.g. website-design-cost" value={formData.slug} onChange={handleInputChange} />
                  <Textarea name="excerpt" placeholder="Short article summary" value={formData.excerpt} onChange={handleInputChange} required />
                  <Input name="metaTitle" placeholder="SEO title" value={formData.metaTitle} onChange={handleInputChange} />
                  <Textarea name="metaDescription" placeholder="SEO description" value={formData.metaDescription} onChange={handleInputChange} />
                  <RichTextEditor value={formData.content} onChange={handleContentChange} />
                  <Input name="author" placeholder="Author" value={formData.author} onChange={handleInputChange} required />
                  <Input name="readTime" placeholder="Read time, e.g. 5 min read" value={formData.readTime} onChange={handleInputChange} required />
                  <Input name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleInputChange} />
                  <Input name="imageAlt" placeholder="Image alt text" value={formData.imageAlt} onChange={handleInputChange} />
                  <Input name="tags" placeholder="Tags, comma-separated" value={formData.tags} onChange={handleInputChange} />
                  <Input name="date" type="date" value={formData.date} onChange={handleInputChange} required />
                  <label className="space-y-2 text-sm font-medium">
                    <span>Publishing status</span>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="draft">Draft</option>
                      <option value="review">In review</option>
                      <option value="published">Published</option>
                    </select>
                  </label>
                  <Button type="submit">{currentPost ? 'Save changes' : 'Save draft'}</Button>
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
          ) : posts.length === 0 ? (
            <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">No posts yet. Add a post or load the prepared SEO drafts above.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{statusLabel(post.status)} · {post.metaDescription || post.excerpt}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="outline" size="sm" onClick={() => openDialogForUpdate(post)}><Edit size={16} /></Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeletePost(post.id)}><Trash size={16} /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManagement;
