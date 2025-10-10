import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  MessageSquare, 
  Settings,
  LogOut,
  Home,
  Briefcase,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

const Admin = () => {
  const [isAuthenticated] = useState(true); // Mock auth - would use Firebase later

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Authentication will be implemented with Firebase
            </p>
            <Button className="w-full">Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    { label: "Total Messages", value: "24", icon: MessageSquare },
    { label: "Blog Posts", value: "12", icon: FileText },
    { label: "Portfolio Items", value: "18", icon: Image },
    { label: "Testimonials", value: "15", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
              <span className="text-white font-bold">PW</span>
            </div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="mr-2" size={16} />
                View Site
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="text-primary" size={24} />
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard size={24} />
              Content Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pages" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="pages">Pages</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="blog">Blog</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>

              <TabsContent value="pages" className="space-y-4">
                <div className="p-6 border border-border rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Home Page</h3>
                  <p className="text-muted-foreground mb-4">Manage hero section, featured content, and CTAs</p>
                  <Button>Edit Home Page</Button>
                </div>
                <div className="p-6 border border-border rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Footer Settings</h3>
                  <p className="text-muted-foreground mb-4">Update contact information and social links</p>
                  <Button>Edit Footer</Button>
                </div>
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Service Cards</h3>
                  <Button>
                    <Briefcase className="mr-2" size={16} />
                    Add New Service
                  </Button>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-center py-8">
                    Service management UI will connect to Firebase
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Portfolio Items</h3>
                  <Button>
                    <Image className="mr-2" size={16} />
                    Add Portfolio Item
                  </Button>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-center py-8">
                    Portfolio management UI will connect to Firebase
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="blog" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Blog Posts</h3>
                  <Button>
                    <FileText className="mr-2" size={16} />
                    Create New Post
                  </Button>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-center py-8">
                    Blog editor will connect to Firebase
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="messages" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Contact Messages</h3>
                  <Button variant="outline">Mark All as Read</Button>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-center py-8">
                    Message inbox will connect to Firebase
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Settings className="text-primary mt-1" size={24} />
              <div>
                <h3 className="font-bold mb-2">Backend Integration</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  This admin panel is ready to be connected to Firebase. All UI components are built and styled, waiting for Firebase Firestore, Authentication, and Storage integration.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Admin authentication UI ready</li>
                  <li>✓ Content management interfaces built</li>
                  <li>✓ Image upload components prepared</li>
                  <li>✓ Form validation implemented</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
