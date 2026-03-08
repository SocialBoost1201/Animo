import React from 'react';

export function LocalBusinessSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "NightClub",
    "name": "Club Animo",
    "alternateName": "クラブアニモ",
    "url": "https://club-animo.com/",
    "telephone": "045-263-6961",
    "image": "https://club-animo.com/images/ogp.jpg",
    "description": "関内の大人の社交場。煌びやかなシャンデリアの下で特別な時間をお過ごしください。",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "相生町３丁目５３ グランドパークビル2F",
      "addressLocality": "横浜市中区",
      "addressRegion": "神奈川県",
      "postalCode": "231-0012",
      "addressCountry": "JP"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 35.4437,
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
        "opens": "21:00",
        "closes": "23:59"
      }
    ],
    "priceRange": "¥9,000〜¥30,000",
    "currenciesAccepted": "JPY",
    "paymentAccepted": "Cash, Credit Card",
    "areaServed": {
      "@type": "City",
      "name": "横浜"
    },
    "hasMap": "https://maps.google.com/maps?q=%E7%A5%9E%E5%A5%88%E5%B7%9D%E7%9C%8C%E6%A8%AA%E6%B5%9C%E5%B8%82%E4%B8%AD%E5%8C%BA%E7%9B%B8%E7%94%9F%E7%94%BA3%E4%B8%81%E7%9B%AE53+%E3%82%B0%E3%83%A9%E3%83%B3%E3%83%89%E3%83%91%E3%83%BC%E3%82%AF%E3%83%93%E3%83%AB"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
