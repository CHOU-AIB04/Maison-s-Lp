import type { Metadata } from "next";
import Script from "next/script";
import { Cairo, Tajawal, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const META_PIXEL_ID = "36659330483710557";
const GTM_ID = "GTM-TLJPKJ7H";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://lp-maison-dor.vercel.app";

// Polices du site maison-dor.store : Cormorant Garamond (titres) + Jost (texte)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["600", "700"],
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["400", "500", "700"],
  display: "swap",
});

// Fallbacks arabes (darija)
const cairo = Cairo({
  preload: false,
  subsets: ["arabic"],
  variable: "--font-cairo",
  weight: ["700"],
  display: "swap",
});

const tajawal = Tajawal({
  preload: false,
  subsets: ["arabic"],
  variable: "--font-tajawal",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Maison d'Or — Parures & Bracelets, livraison gratuite au Maroc",
    template: "%s",
  },
  description:
    "Parures Tulip et Swan en plaqué or 18K et argent rhodié. Livraison gratuite partout au Maroc, paiement à la livraison.",
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" dir="ltr">
      <head>
        {/* Les images viennent de Cloudinary : on ouvre la connexion au plus tôt */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* Google Tag Manager */}
        <Script
          id="gtm-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        {/* End Google Tag Manager */}

        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');`}
        </Script>
      </head>
      <body
        className={`${cormorant.variable} ${jost.variable} ${cairo.variable} ${tajawal.variable} min-h-full antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
