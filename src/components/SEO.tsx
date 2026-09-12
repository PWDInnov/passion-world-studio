import { useEffect } from "react";

type SEOProps = {
  title: string;
  description: string;
  canonical?: string;
  type?: "website" | "article";
  image?: string;
  imageAlt?: string;
  robots?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
};

const siteUrl = "https://www.passionworlddesigns.com";
const defaultImage = `${siteUrl}/hero-background.jpg`;

const absoluteUrl = (value: string) => new URL(value, siteUrl).toString();

const setMeta = (attribute: "name" | "property", key: string, value: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = value;
};

const SEO = ({
  title,
  description,
  canonical,
  type = "website",
  image = defaultImage,
  imageAlt = "PassionWorld Designs creative work",
  robots = "index, follow",
  structuredData,
}: SEOProps) => {
  useEffect(() => {
    const canonicalUrl = absoluteUrl(canonical || window.location.pathname);
    const imageUrl = absoluteUrl(image);

    document.title = title;
    document.documentElement.lang = "en";
    setMeta("name", "description", description);
    setMeta("name", "robots", robots);
    setMeta("name", "author", "PassionWorld Designs");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:site_name", "PassionWorld Designs");
    setMeta("property", "og:image", imageUrl);
    setMeta("property", "og:image:alt", imageAlt);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", imageUrl);
    setMeta("name", "twitter:image:alt", imageAlt);

    let canonicalElement = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement("link");
      canonicalElement.rel = "canonical";
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.href = canonicalUrl;

    const existingStructuredData = document.getElementById("route-structured-data");
    if (structuredData) {
      const script = existingStructuredData || document.createElement("script");
      script.id = "route-structured-data";
      script.setAttribute("type", "application/ld+json");
      script.textContent = JSON.stringify(structuredData);
      if (!existingStructuredData) {
        document.head.appendChild(script);
      }
    } else {
      existingStructuredData?.remove();
    }
  }, [canonical, description, image, imageAlt, robots, structuredData, title, type]);

  return null;
};

export default SEO;
