// Update your src/components/SEO.js
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Benzamods - Premium Car & Bike Customization", 
  description = "Transform your vehicle with premium car & bike wrapping, customization, and modification services", 
  keywords = "car wrapping, bike customization, vehicle modification, vinyl wrap",
  canonical,
  structuredData 
}) => {
  // Default structured data
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "AutoWash",
    "name": "Benzamods",
    "description": "Premium car and bike customization and wrapping services",
    "serviceType": "Vehicle customization, wrapping, modification",
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;