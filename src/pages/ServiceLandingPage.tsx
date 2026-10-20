import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SEO from "@/components/SEO";

type ServiceKey = "graphic-design" | "app-development";

type ServicePageContent = {
  title: string;
  description: string;
  heading: string;
  introduction: string;
  serviceName: string;
  offeringsHeading: string;
  offerings: string[];
  detailHeading: string;
  detail: string;
};

const servicePages: Record<ServiceKey, ServicePageContent> = {
  "graphic-design": {
    title: "Graphic Design & Logo Design Services | PassionWorld Designs",
    description: "Explore graphic design, logo design and brand identity services for your business, including flyers, brochures, packaging and social media graphics.",
    heading: "Graphic Design Services for Your Brand",
    introduction: "Create a clear, consistent visual identity with graphic design for your business. From logo design and brand identity to everyday marketing materials, PassionWorld Designs offers creative services to help your brand communicate across print and digital channels.",
    serviceName: "Graphic Design and Branding",
    offeringsHeading: "Graphic design services",
    offerings: [
      "Logo design and brand identity",
      "Business cards and company profiles",
      "Flyers, posters and brochures",
      "Social media graphics",
      "Billboards and roll-up banners",
      "Packaging and menu design",
    ],
    detailHeading: "Design for print and digital",
    detail: "Whether you are launching a new brand or refreshing existing materials, choose design services that fit your business needs. Explore related website and digital services, or get in touch to discuss the assets you need.",
  },
  "app-development": {
    title: "App Development & Custom Software | PassionWorld Designs",
    description: "Explore mobile app development, web applications and custom software for booking, inventory, point of sale, CRM and other business workflows.",
    heading: "App Development for Your Business",
    introduction: "Explore app development and custom software services for the way your business works. PassionWorld Designs offers mobile app development, web applications and business systems such as booking, inventory, point of sale and CRM solutions.",
    serviceName: "App Development and Custom Software",
    offeringsHeading: "App and software development services",
    offerings: [
      "Mobile app development",
      "Web application development",
      "Booking and reservation systems",
      "Inventory management systems",
      "Point of sale (POS) systems",
      "Customer relationship management (CRM) systems",
    ],
    detailHeading: "Software for everyday workflows",
    detail: "Start with the business process you want your software to support. Explore related website and digital services, or contact PassionWorld Designs to discuss your app or software project.",
  },
};

const ServiceLandingPage = ({ service }: { service: ServiceKey }) => {
  const page = servicePages[service];
  const canonical = `/${service}`;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.serviceName,
    description: page.description,
    url: `https://www.passionworlddesigns.com${canonical}`,
    provider: {
      "@type": "Organization",
      name: "PassionWorld Designs",
      url: "https://www.passionworlddesigns.com/",
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={page.title}
        description={page.description}
        canonical={canonical}
        structuredData={serviceSchema}
      />
      <Header />
      <main id="main-content" className="flex-1">
        <section className="bg-gradient-to-br from-background via-muted/30 to-background py-20 text-center">
          <div className="container mx-auto px-4">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">PassionWorld Designs</p>
            <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-bold md:text-5xl">{page.heading}</h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">{page.introduction}</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/contact">Discuss your project</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/services">View all services</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto grid max-w-5xl gap-12 px-4 md:grid-cols-2 md:items-start">
            <div>
              <h2 className="mb-6 text-3xl font-bold">{page.offeringsHeading}</h2>
              <ul className="grid gap-4">
                {page.offerings.map((offering) => (
                  <li key={offering} className="rounded-lg border border-primary/20 bg-card px-5 py-4 text-card-foreground shadow-sm">
                    {offering}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-muted/40 p-8">
              <h2 className="mb-4 text-2xl font-bold">{page.detailHeading}</h2>
              <p className="leading-relaxed text-muted-foreground">{page.detail}</p>
              <Link to={service === "graphic-design" ? "/app-development" : "/graphic-design"} className="mt-6 inline-flex font-semibold text-primary underline underline-offset-4">
                {service === "graphic-design" ? "Explore app development" : "Explore graphic design"}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceLandingPage;
