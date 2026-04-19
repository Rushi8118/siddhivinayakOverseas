import { Helmet } from 'react-helmet-async'

export default function SEO({ 
  title, 
  description, 
  keywords, 
  ogTitle, 
  ogDescription, 
  ogImage, 
  ogUrl,
  canonical 
}) {
  const siteName = 'SiddhivinayakOverseas'
  const fullTitle = `${title} | ${siteName}`
  const defaultDescription = 'Trusted immigration consultancy with 15+ years experience and 98% success rate. Expert guidance for work permits, study visas, and permanent residency.'
  const defaultKeywords = 'immigration consultant, work permit, study visa, Canada PR, Australia visa, Germany Blue Card, UK skilled worker visa, USA H1B'
  
  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description || defaultDescription} />
      <meta property="og:image" content={ogImage || '/og-image.jpg'} />
      <meta property="og:url" content={ogUrl || window.location.href} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || description || defaultDescription} />
      <meta name="twitter:image" content={ogImage || '/og-image.jpg'} />
      
      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  )
}
