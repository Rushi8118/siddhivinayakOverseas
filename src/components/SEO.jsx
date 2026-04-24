import { Helmet } from 'react-helmet-async'

/**
 * Centralised SEO for Siddhivinayak Overseas.
 * Passes through standard tags + OpenGraph + Twitter card.
 */
export default function SEO({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  canonical,
}) {
  const siteName = 'Siddhivinayak Overseas'
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Study Abroad Consultants for UK, Germany & France`
  const defaultDescription =
    'Premium overseas education consultancy for UK, Germany and France. Expert university admissions, UK Visa & COS assistance, 98% visa success rate. Book a free consultation today.'
  const defaultKeywords =
    'study abroad consultants India, study in UK from India, Germany student visa consultant, France study abroad consultancy, UK COS assistance, overseas education consultants, university admissions India'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta name="theme-color" content="#87CEEB" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description || defaultDescription} />
      <meta property="og:image" content={ogImage || '/og-image.jpg'} />
      <meta property="og:url" content={ogUrl || (typeof window !== 'undefined' ? window.location.href : 'https://siddhivinayakoverseas.com/')} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || description || defaultDescription} />
      <meta name="twitter:image" content={ogImage || '/og-image.jpg'} />

      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  )
}
