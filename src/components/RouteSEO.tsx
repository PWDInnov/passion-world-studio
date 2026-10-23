import { useLocation } from "react-router-dom";
import { getSEOForRoute } from "@/config/seoConfig";
import SEO from "@/components/SEO";

/**
 * RouteSEO automatically tracks the current react-router route location
 * and dynamically injects unique, descriptive meta tags (title, description,
 * canonical, OpenGraph, Twitter Cards, JSON-LD Schema) for every route in App.tsx.
 */
const RouteSEO = () => {
  const location = useLocation();
  const seoData = getSEOForRoute(location.pathname);

  return (
    <SEO
      key={location.pathname}
      title={seoData.title}
      description={seoData.description}
      canonical={seoData.canonical}
      type={seoData.type}
      image={seoData.image}
      imageAlt={seoData.imageAlt}
      robots={seoData.robots}
      structuredData={seoData.structuredData}
    />
  );
};

export default RouteSEO;
