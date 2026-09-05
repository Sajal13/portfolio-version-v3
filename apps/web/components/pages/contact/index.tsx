'use client';

import { useLayoutEffect, useRef } from 'react';
import PageHeader from 'components/common/PageHeader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BootLog from './BootLog';
import ContactForm from './ContactForm';
import SocialLinks from './SocialLinks';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            '.contact-eyebrow',
            '.contact-heading',
            '.contact-terminal',
            '.contact-social'
          ],
          { opacity: 1, y: 0, scale: 1 }
        );
        return;
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top 75%',
            toggleActions: 'play none none none'
          },
          defaults: { ease: 'power3.out' }
        })
        .from('.contact-eyebrow', { opacity: 0, y: -12, duration: 0.5 })
        .from('.contact-heading', { opacity: 0, y: 24, duration: 0.7 }, '-=0.3')
        .from(
          '.contact-terminal',
          { opacity: 0, y: 32, scale: 0.98, duration: 0.6 },
          '-=0.35'
        )
        .from(
          '.contact-social',
          { opacity: 0, y: 16, duration: 0.45, stagger: 0.08 },
          '+=0.2'
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="contact"
      className="relative w-full px-6 py-8 md:px-12"
    >
      <PageHeader
        eyebrow="// contact.sh"
        eyebrowClassName="contact-eyebrow"
        heading="Get in touch"
        headingClassName="contact-heading"
        index="07"
      />
      <div className="mx-auto max-w-5xl">
        <div className="contact-terminal overflow-hidden rounded-xl border border-white/10 bg-[#0A0D12] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_40px_80px_-20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2 text-[11px] tracking-widest text-white/40 uppercase pointer-events-auto px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            <span className="ml-3 font-mono text-xs text-neutral-500"></span>
            <span className="text-[#5EEAD4]">&gt;_</span> Sajal-das --portfolio
          </div>

          <div className="px-6 py-8 font-mono text-sm leading-relaxed md:px-12 md:py-16 md:text-base">
            <BootLog />
            <ContactForm />
          </div>
        </div>

        <SocialLinks />
      </div>
    </section>
  );
}
