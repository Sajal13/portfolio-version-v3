'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { HiBars3, HiXMark } from '@repo/icons/hi2';
import { Button } from '@repo/ui/components';
import { navItems } from 'data/navbar';
import gsap from 'gsap';

export function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const animatingRef = useRef(false);

  const headerRef = useRef<HTMLElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const iconWrapRef = useRef<HTMLSpanElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  // initial gsap state for the menu + its items
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(menuRef.current, { xPercent: 100 });
      gsap.set(itemRefs.current, {
        yPercent: 130,
        opacity: 0,
        rotate: '10deg'
      });
      gsap.set(closeBtnRef.current, { opacity: 0, scale: 0.8 });
    });
    return () => ctx.revert();
  }, []);

  // lock body scroll while the menu is open
  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isOpen);
  }, [isOpen]);

  // close automatically if resized up to desktop width
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024 && isOpen) closeMenu();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Scroll-condense: bar shrinks into a blurred pill past a small threshold —
  // mirrors DesktopNavbar's barRef behavior.
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

  // Hide-on-scroll-down / reveal-on-scroll-up — mirrors DesktopNavbar's
  // headerRef behavior. Skipped while the menu is open so controls stay put.
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

      if (!isOpen) {
        gsap.to(header, {
          yPercent: goingDown && pastThreshold ? -100 : 0,
          duration: 0.4,
          ease: goingDown ? 'power3.inOut' : 'power3.out',
          overwrite: 'auto'
        });
      }

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
  }, [isOpen]);

  function openMenu() {
    if (isOpen || animatingRef.current) return;
    animatingRef.current = true;
    setIsOpen(true);

    // ensure the header is fully visible while the menu is open
    gsap.to(headerRef.current, {
      yPercent: 0,
      duration: 0.3,
      ease: 'power3.out',
      overwrite: 'auto'
    });

    const tl = gsap.timeline({
      onComplete: () => (animatingRef.current = false)
    });

    // fade out the hamburger trigger — the dedicated close button (inside
    // the panel) takes over from here, so it can't get trapped behind the
    // overlay if barRef's backdrop-filter spins up its own stacking context
    tl.to(
      iconWrapRef.current,
      { opacity: 0, rotate: 90, duration: 0.25, ease: 'power2.in' },
      0
    )
      .to(
        menuRef.current,
        { xPercent: 0, duration: 0.55, ease: 'power3.inOut' },
        0
      )
      .to(
        closeBtnRef.current,
        { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' },
        0.25
      )
      .to(
        itemRefs.current,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          rotate: 0,
          ease: 'power4.out'
        },
        0.2
      );
  }

  function closeMenu() {
    if (!isOpen || animatingRef.current) return;
    animatingRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        animatingRef.current = false;
        setIsOpen(false);
      }
    });

    tl.to(
      itemRefs.current,
      {
        yPercent: -60,
        opacity: 0,
        duration: 0.25,
        stagger: -0.04,
        rotate: '10deg',
        ease: 'power2.in'
      },
      0
    )
      .to(
        closeBtnRef.current,
        { opacity: 0, scale: 0.8, duration: 0.2, ease: 'power2.in' },
        0
      )
      .to(
        iconWrapRef.current,
        { opacity: 1, rotate: 0, duration: 0.3, ease: 'power3.inOut' },
        0.1
      )
      .to(
        menuRef.current,
        { xPercent: 100, duration: 0.4, ease: 'power3.inOut' },
        0.1
      );
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 lg:hidden  px-6 py-4"
    >
      <div
        ref={barRef}
        className="flex items-center justify-between px-5 py-4 bg-transparent"
      >
        <Link
          href="#home"
          className="text-sm font-semibold tracking-wide text-primary"
        >
          <span className="text-success-200 font-medium text-[10px] font-orbitron">
            $ whoami
          </span>
          <br />
          Sajal Das
        </Link>

        {/* hamburger trigger — hidden (opacity) once the panel opens; the
            close button below lives inside the panel itself */}
        <Button
          variant="link"
          onClick={openMenu}
          aria-label="Open menu"
          aria-expanded={isOpen}
          aria-hidden={isOpen}
          tabIndex={isOpen ? -1 : 0}
          className="relative z-10"
        >
          <span ref={iconWrapRef} className="inline-flex size-6">
            <HiBars3 className="size-6" />
          </span>
        </Button>
      </div>

      {/* fullscreen menu panel */}
      <div
        ref={menuRef}
        aria-hidden={!isOpen}
        className="fixed inset-0 top-0 bottom-0 h-screen z-100 flex flex-col justify-center bg-secondary-subtle px-10"
        style={{ visibility: isOpen ? 'visible' : 'hidden' }}
      >
        {/* dedicated close button — lives inside the panel's own stacking
            context, so it can never end up trapped behind it */}
        <Button
          variant="link"
          ref={closeBtnRef}
          onClick={closeMenu}
          aria-label="Close menu"
          tabIndex={isOpen ? 0 : -1}
          className="absolute top-6 right-10"
        >
          <HiXMark className="size-6" />
        </Button>

        <nav>
          <ul className="space-y-2">
            {navItems.map((link, i) => (
              <li
                key={link.url}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="overflow-hidden py-2 rotate-10"
              >
                <Link
                  href={link.url}
                  onClick={closeMenu}
                  className="block text-2xl font-semibold text-primary font-mono"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
