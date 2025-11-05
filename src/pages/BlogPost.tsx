
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, Clock, User, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import NotFound from './NotFound';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        setLoading(true);
        try {
          const postDocRef = doc(db, 'blog', id);
          const postDocSnap = await getDoc(postDocRef);
          if (postDocSnap.exists()) {
            setPost({ id: postDocSnap.id, ...postDocSnap.data() });
          } else {
            setPost(null); // Post not found
          }
        } catch (error) {
          console.error("Error fetching post: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-10">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return <NotFound />;
  }

  const { title, content, author, date, readTime, imageUrl, tags, authorImage } = post;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10">
        <article className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Post Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={authorImage || '/default-avatar.png'} alt={author} />
                    <AvatarFallback>{author ? author.charAt(0) : 'A'}</AvatarFallback>
                  </Avatar>
                  <span>{author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>{date ? new Date(date).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>{readTime}</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {imageUrl && (
              <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                <img src={imageUrl} alt={title} className="w-full h-auto object-cover" />
              </div>
            )}

            {/* Post Content */}
            <div 
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content }} 
            />

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <Tag size={16} className="text-muted-foreground" />
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
