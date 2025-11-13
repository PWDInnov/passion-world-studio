
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Phone, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from '@/components/ui/skeleton';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'siteContent', 'footer');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContactInfo(docSnap.data() as { email: string; phone: string; address: string; });
        } else {
          // Set default values if document doesn't exist
          setContactInfo({
            email: 'info@passionworld.com',
            phone: '+1 (555) 123-4567',
            address: '123 Design Street, Creative City, CC 12345'
          });
        }
      } catch (error) {
        console.error("Error fetching contact info: ", error);
        // Set default values on error
        setContactInfo({
            email: 'info@passionworld.com',
            phone: '+1 (555) 123-4567',
            address: '123 Design Street, Creative City, CC 12345'
          });
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Here you would typically handle form submission, e.g., send an email or save to a database
    console.log('Form submitted:', formData);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Your message has been sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-primary/5 py-16 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We'd love to hear from you. Whether you have a question about our services or just want to say hello, get in touch.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message here..."
                      required
                      rows={6}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                  {submitMessage && (
                    <p className="text-center text-green-500">{submitMessage}</p>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <p className="text-muted-foreground mb-6">
                  We're here to answer your questions and discuss your next project. Feel free to reach out through any of these channels.
                </p>
              </div>

              {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                    <Card>
                      <CardContent className="p-6 flex items-center gap-4">
                        <Mail className="w-8 h-8 text-primary" />
                        <div>
                          <h3 className="font-bold">Email</h3>
                          <a href={`mailto:${contactInfo.email}`} className="text-muted-foreground hover:text-primary">{contactInfo.email}</a>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 flex items-center gap-4">
                        <Phone className="w-8 h-8 text-primary" />
                        <div>
                          <h3 className="font-bold">Phone</h3>
                          <a href={`tel:${contactInfo.phone}`} className="text-muted-foreground hover:text-primary">{contactInfo.phone}</a>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 flex items-center gap-4">
                        <MapPin className="w-8 h-8 text-primary" />
                        <div>
                          <h3 className="font-bold">Address</h3>
                          <p className="text-muted-foreground">{contactInfo.address}</p>
                        </div>
                      </CardContent>
                    </Card>
                </div>
              )}

              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Business Hours</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
