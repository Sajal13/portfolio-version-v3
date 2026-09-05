'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { LuDownload, LuArrowDown } from '@repo/icons/lu';
import { Profile } from '@repo/types';
import { Button } from '@repo/ui/components';
import { cn } from '@repo/ui/utils';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useLoaderReady } from 'providers/LoaderContext';

gsap.registerPlugin(ScrambleTextPlugin);

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

const Hero = ({ profile }: { profile: Profile }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLHeadingElement>(null);
  const statRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const ready = useLoaderReady();

  const stats = [
    {
      target: profile.totalYearsOfExperience,
      label: 'Years Experience',
      format: (v: number) => `0${Math.round(v)}+`
    },
    {
      target: profile.totalProjects,
      label: 'Projects',
      format: (v: number) => `${Math.round(v)}+`
    },
    {
      target: profile.totalClients,
      label: 'Clients',
      format: (v: number) => `${Math.round(v)}+`
    }
  ];

  useGSAP(
    () => {
      if (!ready) return;

      const tl = gsap.timeline({ delay: 0.2 });

      if (nameRef.current) {
        tl.to(nameRef.current, {
          duration: 1.4,
          scrambleText: {
            text: 'SAJAL DAS',
            chars: '!<>-_\\/[]{}=+*^?#01',
            revealDelay: 0.4,
            speed: 0.35
          }
        });
      }

      if (roleRef.current) {
        tl.to(
          roleRef.current,
          {
            duration: 1.2,
            scrambleText: {
              text: 'SOFTWARE ENGINEER',
              chars: 'XO01#$%&',
              revealDelay: 0.3,
              speed: 0.4
            }
          },
          '-=0.6'
        );
      }

      // Count-up for the stats row — starts a bit before the text
      // animation wraps up so everything lands around the same time.
      stats.forEach((stat, i) => {
        const el = statRefs.current[i];
        if (!el) return;

        const counter = { val: 0 };

        tl.to(
          counter,
          {
            val: stat.target,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = stat.format(counter.val);
            }
          },
          i === 0 ? '-=0.4' : '<0.15' // stagger each stat slightly after the previous
        );
      });
    },
    { scope: containerRef, dependencies: [ready] }
  );

  const handleCtaEnter = () => {
    gsap.to(ctaRef.current, {
      scale: 1.06,
      boxShadow: '0 0 28px rgba(94, 212, 240, 0.35)',
      duration: 0.35,
      ease: 'power2.out'
    });
  };

  const handleCtaLeave = () => {
    gsap.to(ctaRef.current, {
      scale: 1,
      boxShadow: '0 0 0 rgba(94, 212, 240, 0)',
      duration: 0.35,
      ease: 'power2.out'
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative pt-28 md:pt-8 min-h-[90dvh] w-full overflow-hidden bg-black/90 "
    >
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      <div className="pointer-events-none relative z-10 flex min-h-[90vh] w-full flex-col items-center justify-center bg-black/50 px-6">
        <div className="text-center">
          <h6 className="font-semi font-orbitron text-sm md:text-xl text-success-500 mb-4 md:mb-6">
            // SYSTEM_STATUS: ACTIVE
          </h6>
          <h1
            ref={nameRef}
            className="uppercase font-sans font-black text-4xl md:text-7xl xl:text-8xl mb-4 md:mb-6"
          >
            Sajal Das
          </h1>
          <h2
            ref={roleRef}
            className="text-2xl md:text-3xl xl:text-4xl uppercase bg-clip-text text-transparent bg-linear-to-r from-[#5ED4F0] to-[#B79CFF] mb-6"
          >
            Software engineer
          </h2>
          <p className="text-sm md:text-base text-white/70 mb-10 max-w-2xl mx-auto">
            {profile.description}
          </p>

          {/* Stats row — the glass card */}
          <div
            className={cn(
              'pointer-events-auto mb-10 flex flex-col md:flex-row! flex-wrap items-stretch justify-center',
              'overflow-hidden rounded-xl md:border border-white/10',
              'bg-white/10 backdrop-blur-lg backdrop-saturate-150'
            )}
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  'flex flex-col items-center justify-center px-8 py-5 md:px-12 md:py-6',
                  i !== 0 && 'border-l border-white/10'
                )}
              >
                <span
                  ref={(el) => {
                    statRefs.current[i] = el;
                  }}
                  className="font-orbitron font-bold text-3xl md:text-4xl text-white tabular-nums"
                >
                  {stat.format(0)}
                </span>
                <span className="mt-1 text-[10px] md:text-xs uppercase tracking-widest text-white/60">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA row: Download CV + Scroll to explore */}
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-6">
            <Button
              asChild
              className={cn(
                'group relative gap-2 rounded-md overflow-hidden',
                'bg-secondary-500/10 px-5 py-2.5 backdrop-blur-md',
                'text-sm md:text-base font-orbitron uppercase tracking-wide text-secondary-300',
                'transition-colors hover:bg-secondary-500/20'
              )}
            >
              <Link
                ref={ctaRef}
                href="/api/resume-download"
                download
                onMouseEnter={handleCtaEnter}
                onMouseLeave={handleCtaLeave}
              >
                {/* shimmer sweep */}
                <span
                  className={cn(
                    'pointer-events-none absolute inset-0 -translate-x-full',
                    'bg-linear-to-r from-transparent via-white/20 to-transparent',
                    'transition-transform duration-700 ease-out group-hover:translate-x-full'
                  )}
                />
                <LuDownload className="size-4" />
                <span className="underline underline-offset-4">
                  Download CV
                </span>
                <LuArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
              </Link>
            </Button>

            <Link
              href="#capabilities"
              className={cn(
                'flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest',
                'text-white/70 transition-colors hover:text-white'
              )}
            >
              Scroll to explore
              <LuArrowDown className="size-4 animate-bounce" />
            </Link>
          </div>
        </div>

        <div className="pointer-events-none flex flex-col items-center gap-2 py-4">
          <span className="font-orbitron text-[10px] uppercase tracking-[0.3em] text-white/40">
            scroll_to_discover
          </span>
          <span className="h-6 w-px animate-pulse bg-white/40" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
