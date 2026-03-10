import React from 'react';

interface ArticleSchemaProps {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  authorName?: string;
  authorUrl?: string;
  authorJobTitle?: string;
  publisherName?: string;
  publisherLogo?: string;
}

export function ArticleSchema({
  title,
  description,
  publishedAt,
  updatedAt,
  authorName = 'CLUB Animo 編集部',
  authorUrl = 'https://club-animo.com/system',
  authorJobTitle = 'CLUB Animo 店舗責任者',
  publisherName = 'CLUB Animo',
  publisherLogo = 'https://club-animo.com/images/ogp.jpg',
}: ArticleSchemaProps) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://club-animo.com/',
    },
    headline: title,
    description: description,
    image: publisherLogo,
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
      jobTitle: authorJobTitle,
      worksFor: {
        '@type': 'Organization',
        name: publisherName,
      }
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      logo: {
        '@type': 'ImageObject',
        url: publisherLogo,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
