'use client'

import Image from 'next/image'

// Frame 81 in Figma — full-width hero band. /contact.png is the background
// product collage; a soft dark overlay keeps the white centered copy legible
// regardless of which image is used.
export function ContactHero() {
  return (
    <section className="relative overflow-hidden isolate">
      <Image
        src="/contact.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.32) 100%)' }}
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-6 md:px-12 py-20 md:py-28 text-center">
        <p
          className="text-white"
          style={{ fontSize: 14, lineHeight: '20px', fontWeight: 600 }}
        >
          Support
        </p>
        <h1
          className="mt-3 font-heading text-white"
          style={{ fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.01em' }}
        >
          Contact Us
        </h1>
        <p
          className="mx-auto mt-4 max-w-xl text-white/90"
          style={{ fontSize: 15, lineHeight: '22px' }}
        >
          We&apos;re here to help. Reach out with questions or feedback about mr UK
        </p>
      </div>
    </section>
  )
}
