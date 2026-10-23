import { useEffect } from "react";

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
  ogImage?: string;
  imageAlt?: string;
  robots?: string;
  structuredData?: Record<string, unknown> | object;
}

const BASE_URL = "https://www.passionworlddesigns.com";

const SEO = ({
  title = "Graphic Design, Logo Design & App Development | PassionWorld Designs",
  description = "PassionWorld Designs creates graphic designs, logos, brand identities, mobile apps, websites, and digital marketing solutions for businesses.",
  canonical = "/",
  type = "website",
  image = "https://www.dropbox.com/scl/fi/qm9h1nfzpni5qzs2wydqu/ChatGPT_Image_May_21__2026__10_08_26_AM-removebg-preview.png?rlkey=k9e8ak4q6xwbrltxi3dr0x5l5&st=pbitobzy&raw=1",
  ogImage,
  imageAlt = "PassionWorld Designs - Creative Design & App Development Studio",
  robots = "index, follow",
  structuredData,
}: SEOProps) => {
  const finalImage = ogImage || image;
  const canonicalUrl = canonical.startsWith("http")
    ? canonical
    : `${BASE_URL}${canonical.startsWith("/") ? canonical : `/${canonical}`}`;

  useEffect(() => {
    // 1. Update Document Title
    if (title) {
      document.title = title;
    }

    // Helper to update or create meta tags
    const setMetaTag = (attrName: "name" | "property", attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Standard meta tags
    if (description) {
      setMetaTag("name", "description", description);
    }
    if (robots) {
      setMetaTag("name", "robots", robots);
    }

    // OpenGraph meta tags
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:image", finalImage);
    setMetaTag("property", "og:image:alt", imageAlt);
    setMetaTag("property", "og:site_name", "PassionWorld Designs");

    // Twitter Card meta tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", finalImage);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // JSON-LD Structured Data
    const existingScript = document.getElementById("jsonld-structured-data");
    if (existingScript) {
      existingScript.remove();
    }

    if (structuredData) {
      const script = document.createElement("script");
      script.id = "jsonld-structured-data";
      script.type = "application/ld+json";
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [title, description, canonicalUrl, type, finalImage, imageAlt, robots, structuredData]);

  return null;
};

export default SEO;
