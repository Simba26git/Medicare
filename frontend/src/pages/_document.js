import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Prevent caching to avoid navigation issues */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        
        {/* PWA meta tags */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="description" content="MedCare - Modern Medical Appointment & E-Prescription System" />
        
        {/* Prevent browser back button caching */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for(let registration of registrations) {
                  registration.unregister();
                }
              });
            }
          `
        }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
