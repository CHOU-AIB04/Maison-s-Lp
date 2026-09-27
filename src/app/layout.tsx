import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cairo, Tajawal, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const META_PIXEL_ID = "36659330483710557";
const CLARITY_ID = "xkzwfucjjh";
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
    "Parures Tulip et Swan en acier inoxydable de qualité (doré ou argenté). Livraison gratuite partout au Maroc, paiement à la livraison.",
  robots: { index: true, follow: true },
  icons: { icon: "/logo.jpg", apple: "/logo.jpg" },
};

// Force l'affichage clair (évite le rendu cassé en dark mode / navigateurs in-app IG/FB)
export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#faf6ef",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" dir="ltr">
      <head>
        {/* Les images viennent de Cloudinary : on ouvre la connexion au plus tôt */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* Microsoft Clarity (en direct — plus via GTM, pour éviter le double pixel Meta) */}
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>

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
