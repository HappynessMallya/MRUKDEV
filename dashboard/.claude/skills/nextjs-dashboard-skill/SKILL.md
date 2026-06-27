NextJS Company Website — SKILL.md
Stack: Next.js 14+ · Tailwind CSS · Vercel · TypeScript
PURPOSE
This skill guides AI-assisted development of a secure, high-performance company/marketing website built with Next.js and deployed on Vercel. It covers architecture, folder structure, SEO, performance, security, content management, and Vercel-specific optimizations. Always follow these rules when generating code or design for this project.


STACK & VERSIONS
Layer
Choice
Why
Framework
Next.js 14+ (App Router)
Best-in-class SSG/SSR, SEO metadata API, image optimization
Language
TypeScript (strict mode)
Type safety, fewer bugs, better DX
Styling
Tailwind CSS + shadcn/ui
Fast, consistent, accessible
Animations
Framer Motion
Smooth, performant page transitions and scroll effects
CMS (optional)
Sanity.io or Contentful
Non-dev content editing without redeployment
Forms
React Hook Form + Zod + Resend
Contact forms with email delivery
Hosting
Vercel
Zero-config Next.js deploy, global CDN, preview URLs
DNS + Security
Cloudflare
WAF, DDoS protection, extra CDN layer
Analytics
Vercel Analytics + Google Analytics 4
Privacy-friendly + detailed
Error Tracking
Sentry
Catch production errors before users report them
SEO Auditing
next-sitemap + Google Search Console
Automated sitemap + indexing



FOLDER STRUCTURE
/app

  /layout.tsx              ← Root layout: fonts, metadata, analytics

  /page.tsx                ← Homepage

  /about/page.tsx

  /services

    /page.tsx              ← Services overview

    /[slug]/page.tsx       ← Individual service page (dynamic)

  /blog

    /page.tsx              ← Blog listing

    /[slug]/page.tsx       ← Blog post

  /contact/page.tsx

  /privacy/page.tsx

  /terms/page.tsx

  /not-found.tsx           ← Custom 404 page

  /sitemap.ts              ← Auto-generated sitemap

  /robots.ts               ← robots.txt

  /api

    /contact/route.ts      ← Contact form handler

    /revalidate/route.ts   ← CMS webhook revalidation

/components

  /layout

    Header.tsx             ← Nav with mobile hamburger

    Footer.tsx

    MobileMenu.tsx

  /sections                ← Page sections (Hero, Features, Testimonials, CTA...)

    Hero.tsx

    Features.tsx

    Testimonials.tsx

    Stats.tsx

    CTA.tsx

    FAQ.tsx

    TeamGrid.tsx

    LogoCloud.tsx          ← Client logos / trust signals

  /ui                      ← shadcn primitives + custom atoms

  /forms

    ContactForm.tsx

  /blog

    BlogCard.tsx

    BlogGrid.tsx

/content                   ← If NOT using a CMS: MDX files

  /blog

    /post-slug.mdx

/lib

  /metadata.ts             ← Shared SEO metadata helpers

  /fonts.ts                ← next/font setup

  /utils.ts

  /validations.ts          ← Zod schemas

  /email.ts                ← Resend email client

/public

  /images                  ← Static images (use next/image for these)

  /icons

  /og                      ← Open Graph images

/middleware.ts             ← Security headers + bot blocking


ARCHITECTURE RULES
Static First — Then Dynamic Where Needed
Company pages (Home, About, Services, Contact) → Static Generation (SSG) — fastest possible load.
Blog posts from CMS → ISR (Incremental Static Regeneration) — rebuilds on CMS publish.
Contact form → API Route (Server-side, never expose email keys to client).

// ✅ Static page — runs at BUILD TIME, served from CDN

export default function AboutPage() {

  return <AboutContent />;

}

// ✅ ISR — rebuilds every 60s or on CMS webhook

export const revalidate = 60;

export default async function BlogPost({ params }: { params: { slug: string } }) {

  const post = await fetchPostFromCMS(params.slug);

  return <Article post={post} />;

}
No Client Components Unless Necessary
Use "use client" only for: mobile menu toggle, contact form, scroll animations, interactive FAQ accordion. Everything else is a Server Component.


SEO — CRITICAL FOR COMPANY WEBSITES
Metadata API (Next.js 14)
// app/layout.tsx — Global defaults

import type { Metadata } from "next";

export const metadata: Metadata = {

  metadataBase: new URL("https://yourcompany.com"),

  title: {

    default: "Company Name — Tagline",

    template: "%s | Company Name",         // ← Page title format

  },

  description: "Your company's main description for Google (150–160 chars).",

  openGraph: {

    type: "website",

    locale: "en_US",

    url: "https://yourcompany.com",

    siteName: "Company Name",

    images: [{ url: "/og/default.png", width: 1200, height: 630 }],

  },

  twitter: {

    card: "summary_large_image",

    creator: "@yourhandle",

  },

  robots: {

    index: true,

    follow: true,

    googleBot: { index: true, follow: true, "max-image-preview": "large" },

  },

};

// app/about/page.tsx — Page-specific metadata

export const metadata: Metadata = {

  title: "About Us",   // renders as "About Us | Company Name"

  description: "Learn about our team, mission, and values.",

  openGraph: {

    images: [{ url: "/og/about.png" }],

  },

};
Auto-Generated Sitemap
// app/sitemap.ts

import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {

  const staticPages = ["/", "/about", "/services", "/contact", "/blog"];

  return staticPages.map((url) => ({

    url: `https://yourcompany.com${url}`,

    lastModified: new Date(),

    changeFrequency: url === "/" ? "weekly" : "monthly",

    priority: url === "/" ? 1 : 0.8,

  }));

}
Robots.txt
// app/robots.ts

export default function robots() {

  return {

    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] },

    sitemap: "https://yourcompany.com/sitemap.xml",

  };

}
Structured Data (JSON-LD) — Boosts Google Rich Results
// components/JsonLd.tsx

export function OrganizationSchema() {

  return (

    <script

      type="application/ld+json"

      dangerouslySetInnerHTML={{

        __html: JSON.stringify({

          "@context": "https://schema.org",

          "@type": "Organization",

          name: "Company Name",

          url: "https://yourcompany.com",

          logo: "https://yourcompany.com/logo.png",

          contactPoint: {

            "@type": "ContactPoint",

            telephone: "+1-000-000-0000",

            contactType: "customer service",

          },

          sameAs: [

            "https://linkedin.com/company/yourcompany",

            "https://twitter.com/yourcompany",

          ],

        }),

      }}

    />

  );

}


PERFORMANCE — TARGET LIGHTHOUSE 90+ ON ALL METRICS
Fonts — Use next/font (Zero Layout Shift)
// lib/fonts.ts

import { Inter, Geist } from "next/font/google";

export const inter = Inter({

  subsets: ["latin"],

  variable: "--font-inter",

  display: "swap",

});

export const geist = Geist({

  subsets: ["latin"],

  variable: "--font-geist",

  weight: ["400", "600", "700"],

  display: "swap",

});
Images — Always next/image, Never 
import Image from "next/image";

// Hero image — priority load (above the fold)

<Image

  src="/images/hero.jpg"

  alt="Team working together"

  width={1200}

  height={600}

  priority                       // ← preloads immediately

  className="w-full h-auto"

/>

// Below-fold images — lazy loaded by default

<Image

  src="/images/team.jpg"

  alt="Our team"

  width={800}

  height={600}

  sizes="(max-width: 768px) 100vw, 50vw"   // ← responsive sizing

/>
Vercel-Specific Performance
// next.config.ts

const nextConfig = {

  images: {

    formats: ["image/avif", "image/webp"],    // Modern formats

    remotePatterns: [

      { protocol: "https", hostname: "cdn.sanity.io" },  // If using Sanity

    ],

  },

  experimental: {

    optimizePackageImports: ["lucide-react", "framer-motion"],

  },

};
Core Web Vitals Targets
Metric
Target
What Affects It
LCP (Largest Contentful Paint)
< 2.5s
Hero image priority, font loading
FID/INP (Interaction)
< 200ms
JS bundle size, hydration
CLS (Layout Shift)
< 0.1
Font display:swap, image dimensions
TTFB (Time to First Byte)
< 800ms
Vercel Edge, CDN cache



SECURITY
Security Headers via Middleware
// middleware.ts

import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");

  response.headers.set("X-Content-Type-Options", "nosniff");

  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  response.headers.set(

    "Strict-Transport-Security",

    "max-age=31536000; includeSubDomains; preload"  // Force HTTPS

  );

  response.headers.set(

    "Content-Security-Policy",

    [

      "default-src 'self'",

      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",

      "style-src 'self' 'unsafe-inline'",

      "img-src 'self' data: https:",

      "font-src 'self'",

      "connect-src 'self' https://vitals.vercel-insights.com",

    ].join("; ")

  );

  return response;

}

export const config = {

  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],

};
Contact Form — Server-Side Only
// app/api/contact/route.ts

import { NextRequest, NextResponse } from "next/server";

import { Resend } from "resend";

import { z } from "zod";

import { ratelimit } from "@/lib/ratelimit";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({

  name: z.string().min(2).max(100),

  email: z.string().email(),

  message: z.string().min(10).max(2000),

  // Honeypot field — bots fill it, humans don't

  website: z.string().max(0, "Bot detected"),

});

export async function POST(req: NextRequest) {

  // Rate limit: 3 submissions per IP per hour

  const ip = req.ip ?? "anonymous";

  const { success } = await ratelimit.limit(ip);

  if (!success) {

    return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  }

  const body = await req.json();

  const result = schema.safeParse(body);

  if (!result.success) {

    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  }

  const { name, email, message } = result.data;

  await resend.emails.send({

    from: "website@yourcompany.com",

    to: "hello@yourcompany.com",

    subject: `New contact from ${name}`,

    html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`,

  });

  return NextResponse.json({ success: true });

}
Environment Variables
# .env.local — never commit

RESEND_API_KEY=""

NEXT_PUBLIC_GA_ID=""                   # Google Analytics (public is fine)

SANITY_PROJECT_ID=""                   # If using Sanity CMS

SANITY_DATASET="production"

SANITY_API_TOKEN=""                    # Server-side only

UPSTASH_REDIS_REST_URL=""             # Rate limiting

UPSTASH_REDIS_REST_TOKEN=""


PAGE SECTION PATTERNS
Hero Section
// components/sections/Hero.tsx

import Image from "next/image";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Hero() {

  return (

    <section className="relative min-h-[90vh] flex items-center overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0 -z-10">

        <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover" priority />

        <div className="absolute inset-0 bg-black/50" />  {/* Overlay */}

      </div>

      <div className="container mx-auto px-4 text-white">

        <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-3xl">

          Your Compelling Headline Here

        </h1>

        <p className="mt-6 text-xl text-white/80 max-w-xl">

          Supporting description that explains what you do and who it's for.

        </p>

        <div className="mt-10 flex gap-4 flex-wrap">

          <Button size="lg" asChild>

            <Link href="/contact">Get Started</Link>

          </Button>

          <Button size="lg" variant="outline" className="text-white border-white" asChild>

            <Link href="/services">Learn More</Link>

          </Button>

        </div>

      </div>

    </section>

  );

}
Navigation Header
// components/layout/Header.tsx

"use client";

import { useState, useEffect } from "react";

import Link from "next/link";

import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

const navLinks = [

  { href: "/about", label: "About" },

  { href: "/services", label: "Services" },

  { href: "/blog", label: "Blog" },

  { href: "/contact", label: "Contact" },

];

export function Header() {

  const [open, setOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {

    const onScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);

  }, []);

  return (

    <header className={cn(

      "fixed top-0 w-full z-50 transition-all duration-300",

      scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"

    )}>

      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        <Link href="/" className="font-bold text-xl">Company</Link>

        {/* Desktop nav */}

        <nav className="hidden md:flex items-center gap-8">

          {navLinks.map(({ href, label }) => (

            <Link key={href} href={href} className="text-sm font-medium hover:text-primary transition-colors">

              {label}

            </Link>

          ))}

          <Button asChild><Link href="/contact">Get in Touch</Link></Button>

        </nav>

        {/* Mobile toggle */}

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">

          {open ? <X /> : <Menu />}

        </button>

      </div>

      {/* Mobile menu */}

      {open && (

        <div className="md:hidden bg-white border-t px-4 py-6 space-y-4">

          {navLinks.map(({ href, label }) => (

            <Link key={href} href={href} className="block text-sm font-medium py-2" onClick={() => setOpen(false)}>

              {label}

            </Link>

          ))}

          <Button className="w-full" asChild><Link href="/contact">Get in Touch</Link></Button>

        </div>

      )}

    </header>

  );

}


VERCEL DEPLOYMENT
vercel.json
{

  "headers": [

    {

      "source": "/(.*)",

      "headers": [

        { "key": "X-Frame-Options", "value": "DENY" },

        { "key": "X-Content-Type-Options", "value": "nosniff" }

      ]

    },

    {

      "source": "/fonts/(.*)",

      "headers": [

        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }

      ]

    }

  ],

  "redirects": [

    { "source": "/home", "destination": "/", "permanent": true }

  ]

}
Deployment Checklist
Domain connected in Vercel dashboard
All env vars set in Vercel → Settings → Environment Variables
Preview deployments enabled (auto on every PR)
NEXTAUTH_URL set to production URL
Cloudflare DNS pointing to Vercel (proxy enabled for WAF)
SSL certificate auto-provisioned (Vercel does this automatically)
www → apex domain redirect configured
Google Search Console: sitemap submitted
Vercel Analytics enabled in project settings


STANDARD PAGES CHECKLIST
Every company website needs:

Home — Hero, value prop, services summary, social proof, CTA
About — Story, mission, team, values
Services — Overview + individual service pages
Blog — Listing + individual posts (great for SEO)
Contact — Form + address + map embed
Privacy Policy — Required by law in most regions
Terms of Service
404 page — Branded, with navigation links
Cookie banner — If targeting EU users (GDPR)


WHEN USING THIS SKILL
When generating any file for this project, always:

Use TypeScript — no any types.
Use next/image for all images — never raw <img>.
Use next/font for all fonts — never CDN font links.
Add export const metadata to every page file.
Keep all secrets server-side — nothing sensitive in NEXT_PUBLIC_ vars.
Target Lighthouse 90+ — check image sizes and JS bundle before finishing.
Make every page responsive — mobile layout first, then desktop.
Include loading states (loading.tsx) for any async pages.
Write semantic HTML — use <header>, <main>, <footer>, <section>, <article>.
Validate all form inputs with Zod on the server — never trust client data.

