import type { Metadata } from "next";
import Script from "next/script";
import { Cairo, Tajawal, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const META_PIXEL_ID = "36659330483710557";

// Polices du site maison-dor.store : Cormorant Garamond (titres) + Jost (texte)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["500", "600", "700"],
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Fallbacks arabes (darija)
const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  weight: ["600", "700", "800"],
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  variable: "--font-tajawal",
  weight: ["400", "500", "700"],
  display: "swap",
});

const SITE = "https://lp-maison-dor.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Ensemble Swan 🦢 - Collier + Bracelet | Maison d'Or",
  description:
    "Ensemble Swan : collier + bracelet plaqué or, design élégant. Paiement à la réception, livraison partout au Maroc. Commandez maintenant.",
  openGraph: {
    title: "Ensemble Swan 🦢 - Maison d'Or",
    description:
      "Collier + bracelet plaqué or. Paiement à la réception, livraison partout au Maroc.",
    type: "website",
    locale: "ar_MA",
    url: SITE,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
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
      <body className={`${cormorant.variable} ${jost.variable} ${cairo.variable} ${tajawal.variable} min-h-full antialiased`}>
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
