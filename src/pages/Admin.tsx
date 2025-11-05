
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  MessageSquare, 
  LogOut,
  Home,
  Briefcase,
  Star,
  PlusCircle,
  Trash, 
  Pencil,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { useState, useEffect } from "react";
import useFirestore from "../hooks/use-firestore";
import PortfolioForm from "../components/PortfolioForm";
import FooterForm from "../components/FooterForm";
import HomePageForm from "../components/HomePageForm";
import ServiceForm from "../components/ServiceForm";
import BlogManagement from "../components/BlogManagement";
import TestimonialForm from "../components/TestimonialForm";
import { deleteDoc, doc, updateDoc, collection, getDocs, addDoc } from "firebase/firestore";

const Admin = () => {
  const [user, loading] = useAuthState(auth);
  const { docs: messages, setDocs: setMessages } = useFirestore('messages');
  const { docs: blogPosts } = useFirestore('blog');
  const { docs: portfolioItems, setDocs: setPortfolioItems } = useFirestore('portfolio');
  const { docs: testimonials, setDocs: setTestimonials } = useFirestore('testimonials');
  const { docs: services, setDocs: setServices } = useFirestore('services');

  const [isPortfolioFormOpen, setIsPortfolioFormOpen] = useState(false);
  const [isFooterFormOpen, setIsFooterFormOpen] = useState(false);
  const [isHomePageFormOpen, setIsHomePageFormOpen] = useState(false);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [isTestimonialFormOpen, setIsTestimonialFormOpen] = useState(false);

  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState(null);
  const [selectedServiceItem, setSelectedServiceItem] = useState(null);
  const [selectedTestimonialItem, setSelectedTestimonialItem] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const seedData = async () => {
    // Seed Portfolio
    const portfolioCollection = collection(db, 'portfolio');
    let portfolioSnapshot = await getDocs(portfolioCollection);
    if (portfolioSnapshot.empty) {
        const dummyPortfolio = [
            {
                title: "Corporate Branding Suite",
                description: "A comprehensive branding package for a leading tech company, including logo, guidelines, and marketing materials.",
                imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
                category: "branding",
                tags: ["Logo Design", "Brand Identity", "Marketing"],
            },
            {
                title: "E-commerce Platform UX",
                description: "A complete redesign of a major e-commerce website, focusing on user experience and conversion rate optimization.",
                imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop",
                category: "web",
                tags: ["UX/UI", "E-commerce", "Web Design"],
            },
        ];
        for (const item of dummyPortfolio) { await addDoc(portfolioCollection, item); }
        portfolioSnapshot = await getDocs(portfolioCollection);
    }
    setPortfolioItems(portfolioSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    // Seed Testimonials
    const testimonialsCollection = collection(db, 'testimonials');
    let testimonialsSnapshot = await getDocs(testimonialsCollection);
    if (testimonialsSnapshot.empty) {
        const dummyTestimonials = [
            {
                name: "Sarah Johnson",
                role: "CEO, TechStart Inc.",
                quote: "Working with this team was a game-changer for our brand. Their design insights and technical expertise are unmatched.",
                imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
                rating: 5,
            },
        ];
        for (const item of dummyTestimonials) { await addDoc(testimonialsCollection, item); }
        testimonialsSnapshot = await getDocs(testimonialsCollection);
    }
    setTestimonials(testimonialsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    // Seed Services
    const servicesCollection = collection(db, 'services');
    let servicesSnapshot = await getDocs(servicesCollection);
    if (servicesSnapshot.empty) {
        const dummyServices = [
            {
                title: "Brand Identity",
                description: "Crafting memorable brand identities that resonate with your audience and stand the test of time.",
            },
            {
                title: "Web Development",
                description: "Beautiful, fast, and functional websites built with the latest technologies, optimized for all devices.",
            },
            {
                title: "Digital Marketing",
                description: "Strategic digital marketing campaigns that drive results, from social media to content marketing.",
            },
        ];
        for (const item of dummyServices) { await addDoc(servicesCollection, item); }
        servicesSnapshot = await getDocs(servicesCollection);
    }
    setServices(servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    if (user) {
        seedData();
    }
  }, [user]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError("Failed to sign in. Please check your email and password.");
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const closePageForms = () => {
    setIsFooterFormOpen(false);
    setIsHomePageFormOpen(false);
  };

  const handleSavePortfolioItem = async () => {
    setIsPortfolioFormOpen(false);
    setSelectedPortfolioItem(null);
    const snapshot = await getDocs(collection(db, 'portfolio'));
    setPortfolioItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };
  const handleDeletePortfolioItem = async (id) => {
    await deleteDoc(doc(db, 'portfolio', id));
    setPortfolioItems(portfolioItems.filter(item => item.id !== id));
  };

  const handleSaveServiceItem = async () => {
    setIsServiceFormOpen(false);
    setSelectedServiceItem(null);
    const snapshot = await getDocs(collection(db, 'services'));
    setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };
  const handleDeleteServiceItem = async (id) => {
    await deleteDoc(doc(db, 'services', id));
    setServices(services.filter(item => item.id !== id));
  };
  
  const handleSaveTestimonialItem = (savedItem) => {
    if (selectedTestimonialItem) {
      setTestimonials(testimonials.map(item => item.id === savedItem.id ? savedItem : item));
    } else {
      setTestimonials([savedItem, ...testimonials]);
    }
    setIsTestimonialFormOpen(false);
    setSelectedTestimonialItem(null);
  };

  const handleDeleteTestimonialItem = async (id) => {
    await deleteDoc(doc(db, 'testimonials', id));
    setTestimonials(testimonials.filter(item => item.id !== id));
  };

  const handleDeleteMessage = async (id) => {
    await deleteDoc(doc(db, 'messages', id));
    setMessages(messages.filter(m => m.id !== id));
    setSelectedMessage(null);
  };
  
  const handleMarkAsRead = async (id) => {
    await updateDoc(doc(db, "messages", id), { read: true });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-muted/30"><p>Loading...</p></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>Admin Login</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn}>
              <div className="space-y-4">
                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full">Login</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    { label: "Total Messages", value: messages.length, icon: MessageSquare },
    { label: "Blog Posts", value: blogPosts.length, icon: FileText },
    { label: "Portfolio Items", value: portfolioItems.length, icon: Image },
    { label: "Testimonials", value: testimonials.length, icon: Star },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
       <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center"><span className="text-white font-bold">PW</span></div><h1 className="text-xl font-bold">Admin Dashboard</h1></div>
          <div className="flex items-center gap-4"><Link to="/"><Button variant="outline" size="sm"><Home className="mr-2" size={16} />View Site</Button></Link><Button variant="ghost" size="sm" onClick={signOut}><LogOut size={16} /></Button></div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="hover-lift" style={{ animationDelay: `${index * 0.1}s` }}><CardContent className="p-6"><div className="flex items-center justify-between mb-2"><stat.icon className="text-primary" size={24} /><span className="text-3xl font-bold">{stat.value}</span></div><p className="text-sm text-muted-foreground">{stat.label}</p></CardContent></Card>
          ))}
        </div>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><LayoutDashboard size={24} /> Content Management</CardTitle></CardHeader>
          <CardContent>
            <Tabs defaultValue="messages" className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6"><TabsTrigger value="pages">Pages</TabsTrigger><TabsTrigger value="services">Services</TabsTrigger><TabsTrigger value="portfolio">Portfolio</TabsTrigger><TabsTrigger value="blog">Blog</TabsTrigger><TabsTrigger value="testimonials">Testimonials</TabsTrigger><TabsTrigger value="messages">Messages</TabsTrigger></TabsList>

              <TabsContent value="pages" className="space-y-4">
                {isHomePageFormOpen ? <HomePageForm onSave={closePageForms} onCancel={closePageForms} />
                : isFooterFormOpen ? <FooterForm onSave={closePageForms} onCancel={closePageForms} />
                : <><div className="p-6 border border-border rounded-lg"><h3 className="text-lg font-bold mb-2">Home Page</h3><p className="text-muted-foreground mb-4">Manage hero section, featured content, and CTAs</p><Button onClick={() => setIsHomePageFormOpen(true)}>Edit Home Page</Button></div><div className="p-6 border border-border rounded-lg"><h3 className="text-lg font-bold mb-2">Footer Settings</h3><p className="text-muted-foreground mb-4">Update contact information and social links</p><Button onClick={() => setIsFooterFormOpen(true)}>Edit Footer</Button></div></>}
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                 {isServiceFormOpen ? <ServiceForm item={selectedServiceItem} onSave={handleSaveServiceItem} onCancel={() => { setIsServiceFormOpen(false); setSelectedServiceItem(null); }} />
                : <div>
                    <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">Service Cards</h3><Button onClick={() => { setSelectedServiceItem(null); setIsServiceFormOpen(true); }}><Briefcase className="mr-2" size={16} />Add New Service</Button></div>
                    <div className="border border-border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map(service => (
                        <Card key={service.id}><CardContent className="p-4 flex justify-between items-center"><div><h4 className="font-bold">{service.title}</h4><p className="text-sm text-muted-foreground">{service.description}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => { setSelectedServiceItem(service); setIsServiceFormOpen(true); }}><Pencil size={14} /></Button><Button variant="destructive" size="sm" onClick={() => handleDeleteServiceItem(service.id)}><Trash size={14} /></Button></div></CardContent></Card>
                      ))}
                    </div>
                  </div>}
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-4">
                {isPortfolioFormOpen ? <PortfolioForm item={selectedPortfolioItem} onSave={handleSavePortfolioItem} onCancel={() => { setIsPortfolioFormOpen(false); setSelectedPortfolioItem(null);}}/>
                : <div>
                    <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">Portfolio Items</h3><Button onClick={() => { setSelectedPortfolioItem(null); setIsPortfolioFormOpen(true); }}><PlusCircle className="mr-2" size={16} />Add Portfolio Item</Button></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {portfolioItems.map(item => (
                        <Card key={item.id}><CardContent className="p-4"><img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover rounded-md mb-4" /><h4 className="font-bold mb-2">{item.title}</h4><p className="text-muted-foreground text-sm mb-4">{item.description}</p><div className="flex justify-end gap-2"><Button variant="outline" size="sm" onClick={() => { setSelectedPortfolioItem(item); setIsPortfolioFormOpen(true); }}><Pencil size={14} /></Button><Button variant="destructive" size="sm" onClick={() => handleDeletePortfolioItem(item.id)}><Trash size={14} /></Button></div></CardContent></Card>
                      ))}
                    </div>
                  </div>}
              </TabsContent>

              <TabsContent value="blog"><BlogManagement /></TabsContent>
              
              <TabsContent value="testimonials" className="space-y-4">
                {isTestimonialFormOpen ? <TestimonialForm item={selectedTestimonialItem} onSave={handleSaveTestimonialItem} onCancel={() => { setIsTestimonialFormOpen(false); setSelectedTestimonialItem(null);}}/>
                : <div>
                    <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">Testimonials</h3><Button onClick={() => { setSelectedTestimonialItem(null); setIsTestimonialFormOpen(true); }}><Star className="mr-2" size={16} />Add New Testimonial</Button></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {testimonials.map(item => (
                        <Card key={item.id}><CardContent className="p-4 flex flex-col justify-between h-full"><div className="flex-grow"><img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-full object-cover mb-4" /><p className='italic'>"{item.quote}"</p></div><div className="mt-4"><h4 className="font-bold">{item.name}</h4><p className="text-sm text-muted-foreground">{item.role}</p></div><div className="flex justify-end gap-2 mt-4"><Button variant="outline" size="sm" onClick={() => { setSelectedTestimonialItem(item); setIsTestimonialFormOpen(true); }}><Pencil size={14} /></Button><Button variant="destructive" size="sm" onClick={() => handleDeleteTestimonialItem(item.id)}><Trash size={14} /></Button></div></CardContent></Card>
                      ))}
                    </div>
                  </div>}
              </TabsContent>

              <TabsContent value="messages" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1"><Card><CardHeader><CardTitle>Inbox</CardTitle></CardHeader><CardContent className="p-2"><div className="space-y-2">{messages.length > 0 ? messages.map(msg => (<div key={msg.id} className={`p-3 rounded-lg cursor-pointer ${selectedMessage?.id === msg.id ? 'bg-primary/10' : 'hover:bg-muted/50'} ${!msg.read ? 'font-bold' : ''}`} onClick={() => { setSelectedMessage(msg); if (!msg.read) handleMarkAsRead(msg.id); }}><h4>{msg.name}</h4><p className="text-sm text-muted-foreground truncate">{msg.subject}</p></div>)) : <p className="text-sm text-muted-foreground text-center p-4">No messages yet.</p>}</div></CardContent></Card></div>
                <div className="md:col-span-2"><Card className="h-full"><CardHeader><CardTitle>Message Details</CardTitle></CardHeader><CardContent>{selectedMessage ? (<div className="space-y-4"><div className="flex justify-between items-start"><div><h3 className="font-bold text-lg">{selectedMessage.name}</h3><a href={`mailto:${selectedMessage.email}`} className="text-sm text-muted-foreground hover:underline">{selectedMessage.email}</a></div><Button variant="destructive" size="sm" onClick={() => handleDeleteMessage(selectedMessage.id)}><Trash className="mr-2" size={14} /> Delete</Button></div><p className="font-semibold">Subject: {selectedMessage.subject}</p><div className="p-4 bg-muted/50 rounded-lg whitespace-pre-wrap">{selectedMessage.message}</div><p className="text-xs text-muted-foreground pt-4 border-t">{new Date(selectedMessage.timestamp?.seconds * 1000).toLocaleString()}</p></div>) : (<div className="flex flex-col items-center justify-center h-full text-center py-12"><Mail size={48} className="text-muted-foreground mb-4"/><p className="text-muted-foreground">Select a message to view its details</p></div>)}</CardContent></Card></div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
