'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { navItems } from 'data/navbar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function DesktopNavbar() {
  const headerRef = useRef<HTMLElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const underlineRef = useRef<HTMLSpanElement | null>(null);

  const [activeHref, setActiveHref] = useState<string>(
    navItems[0]?.url ?? '#home'
  );

  // Mount animation: fade/slide the bar in, then stagger the links.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(headerRef.current, {
        opacity: 0,
        y: -16,
        duration: 0.6
      })
        .from(logoRef.current, { opacity: 0, y: -8, duration: 0.4 }, '-=0.35')
        .from(
          Object.values(linkRefs.current),
          {
            opacity: 0,
            y: -8,
            duration: 0.4,
            stagger: 0.06
          },
          '-=0.3'
        );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  // Scroll-condense: bar shrinks into a blurred pill past a small threshold.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let isScrolled = false;
    const blurState = { value: 0 }; // proxy object GSAP can actually tween

    const applyState = (scrolled: boolean) => {
      if (scrolled === isScrolled) return;
      isScrolled = scrolled;

      gsap.to(bar, {
        marginTop: scrolled ? 12 : 0,
        paddingTop: scrolled ? 12 : 24,
        paddingBottom: scrolled ? 12 : 24,
        backgroundColor: scrolled ? 'rgba(71,85,105,0.7)' : 'rgba(71,85,105,0)',
        borderRadius: scrolled ? 999 : 0,
        boxShadow: scrolled ? '0 10px 30px -10px rgba(0,0,0,0.4)' : 'none',
        duration: 0.3,
        overwrite: 'auto'
      });

      gsap.to(blurState, {
        value: scrolled ? 12 : 0,
        duration: 0.3,
        overwrite: 'auto',
        onUpdate: () => {
          bar.style.backdropFilter = `blur(${blurState.value}px)`;
        }
      });
    };

    bar.style.backdropFilter = 'blur(0px)';

    const onScroll = () => applyState(window.scrollY > 8);
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: a ScrollTrigger per section drives the active link.
  useEffect(() => {
    const triggers = navItems.map((link) => {
      const section = document.querySelector<HTMLElement>(link.url);
      if (!section) return null;

      return ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) setActiveHref(link.url);
        }
      });
    });

    return () => triggers.forEach((t) => t?.kill());
  }, []);

  // Slide the underline under the active link whenever it changes.
  useEffect(() => {
    const el = linkRefs.current[activeHref];
    const underline = underlineRef.current;
    if (!el || !underline) return;

    gsap.to(underline, {
      left: el.offsetLeft,
      width: el.offsetWidth,
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out'
    });
  }, [activeHref]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const HIDE_AFTER = 120; // px scrolled before hiding is allowed to kick in
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const currentY = window.scrollY;
      const goingDown = currentY > lastY;
      const pastThreshold = currentY > HIDE_AFTER;

      gsap.to(header, {
        yPercent: goingDown && pastThreshold ? -100 : 0,
        duration: 0.4,
        ease: goingDown ? 'power3.inOut' : 'power3.out',
        overwrite: 'auto'
      });

      lastY = currentY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 max-lg:hidden! block px-6"
    >
      <div
        ref={barRef}
        className="flex items-center justify-between bg-transparent px-8 py-6"
      >
        <Link
          ref={logoRef}
          href="#home"
          className="text-sm font-semibold tracking-wide text-primary"
        >
          <span className="text-success-200 font-medium text-[10px] font-orbitron">
            $ whoami
          </span>
          <br />
          Sajal Das
        </Link>

        <nav className="relative">
          <ul className="flex items-center gap-8">
            {navItems.map((link) => (
              <li key={link.url}>
                <Link
                  ref={(el) => {
                    linkRefs.current[link.url] = el;
                  }}
                  href={link.url}
                  aria-current={activeHref === link.url ? 'page' : undefined}
                  className={[
                    'text-sm font-medium transition-colors font-mono',
                    activeHref === link.url
                      ? 'text-primary'
                      : 'text-primary/60 hover:text-primary'
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* GSAP-driven underline, positioned off measured link offsets */}
          <span
            ref={underlineRef}
            aria-hidden
            className="pointer-events-none absolute -bottom-2 h-px bg-white opacity-0"
          />
        </nav>
      </div>
    </header>
  );
}
