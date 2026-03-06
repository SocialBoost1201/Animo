import React from 'react';

export function LocalBusinessSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "NightClub",
    "name": "Club Animo",
    "image": "https://animo.example.com/images/ogp.jpg",
    "url": "https://animo.example.com/",
    "telephone": "045-263-6961", // TBD: 実際の電話番号
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "町名番地ビル名", // TBD: 実際の住所
      "addressLocality": "横浜市中区",
      "addressRegion": "神奈川県",
      "postalCode": "231-0014",
      "addressCountry": "JP"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 35.4437, // TBD: 実際の緯度経度
      "longitude": 139.6380
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "20:00",
        "closes": "23:59"
      }
    ],
    "priceRange": "$$$"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
