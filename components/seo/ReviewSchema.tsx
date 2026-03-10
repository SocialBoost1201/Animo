import React from 'react';

interface ReviewSchemaProps {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export function ReviewSchema({
  ratingValue,
  reviewCount,
  bestRating = 5,
  worstRating = 1
}: ReviewSchemaProps) {
  if (reviewCount === 0) return null;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "NightClub",
    "name": "Club Animo",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue.toFixed(1),
      "reviewCount": reviewCount.toString(),
      "bestRating": bestRating.toString(),
      "worstRating": worstRating.toString()
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
