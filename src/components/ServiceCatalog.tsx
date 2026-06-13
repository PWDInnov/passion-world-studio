import { Check } from "lucide-react";
import { serviceCatalog } from "@/data/serviceCatalog";

const ServiceCatalog = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Offer</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete range of digital and creative services to grow your business.
          </p>
        </div>

        <div className="flex flex-col gap-16">
          {serviceCatalog.map((category, index) => (
            <div
              key={category.title}
              className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                index % 2 === 1 ? "lg:[direction:rtl]" : ""
              }`}
            >
              {/* Image */}
              <div className="lg:[direction:ltr]">
                <div className="overflow-hidden rounded-2xl shadow-lg gold-border-glow border border-primary/20">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={`${category.title} showcase`}
                    className="w-full h-64 md:h-80 object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="lg:[direction:ltr]">
                <h3 className="text-2xl md:text-3xl font-bold mb-3 gold-text-gradient inline-block">
                  {category.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {category.description}
                </p>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  {category.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3 w-3 text-primary" />
                      </span>
                      <span className="text-sm text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCatalog;
