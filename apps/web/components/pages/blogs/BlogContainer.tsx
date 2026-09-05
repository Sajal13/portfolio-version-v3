'use client';

import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { FaChevronLeft, FaChevronRight } from '@repo/icons/fa';
import { Blog } from '@repo/types';
import { Button } from '@repo/ui/components';
import PageHeader from 'components/common/PageHeader';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BlogCard } from './BlogCard';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

// Mobile browsers hide/show their address bar while you scroll, which fires
// a `resize` event. Without this, ScrollTrigger re-measures the pinned
// section mid-scroll on that event and the whole thing visibly jumps.
ScrollTrigger.config({ ignoreMobileResize: true });

interface BlogContainerProps {
  blogs: Blog[];
}

const GAP = 24;
const DESKTOP_CARD_WIDTH = 380;
const MOBILE_BREAKPOINT = 640;
const MOBILE_SIDE_INSET = 32; // leaves a small peek of the next card

const BlogContainer = ({ blogs }: BlogContainerProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const indexRef = useRef(0);

  const [containerWidth, setContainerWidth] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(blogs.length <= 1);

  // Measure the section itself (not window.innerWidth) so centering is
  // correct even if this sits inside a max-width wrapper, and so it isn't
  // re-triggered by mobile chrome hide/show — that only changes height.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(Math.round(entry!.contentRect?.width));
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const isMobile = containerWidth > 0 && containerWidth < MOBILE_BREAKPOINT;
  const cardWidth =
    containerWidth === 0
      ? DESKTOP_CARD_WIDTH
      : isMobile
        ? containerWidth - MOBILE_SIDE_INSET * 2
        : DESKTOP_CARD_WIDTH;
  const cardStep = cardWidth + GAP;
  const sidePadding = isMobile
    ? Math.max(0, (containerWidth - cardWidth) / 2)
    : 24; // matches the old px-6 on tablet/desktop

  useGSAP(
    () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section || blogs.length === 0 || containerWidth === 0) {
        return;
      }

      const distance = (blogs.length - 1) * cardStep;
      indexRef.current = 0;

      if (distance <= 0) {
        setAtStart(true);
        setAtEnd(true);
        return;
      }

      const tween = gsap.to(track, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'center center',
          end: `+=${distance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.round(self.progress * (blogs.length - 1));
            indexRef.current = index;
            setAtStart(index <= 0);
            setAtEnd(index >= blogs.length - 1);
          }
        }
      });

      stRef.current = tween.scrollTrigger ?? null;
    },
    { scope: sectionRef, dependencies: [blogs, cardStep, containerWidth] }
  );

  const step = (direction: 1 | -1) => {
    const st = stRef.current;
    if (!st) return;

    const targetIndex = gsap.utils.clamp(
      0,
      blogs.length - 1,
      indexRef.current + direction
    );
    const targetY = st.start + targetIndex * cardStep;

    gsap.to(window, {
      duration: 0.8,
      ease: 'power2.out',
      scrollTo: { y: targetY }
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="// blogs"
        heading="Latest Writings"
        index="06"
        hasNavigation
      >
        <div className="flex items-center justify-end gap-3 px-6 pt-4">
          <Button
            type="button"
            aria-label="Previous blog"
            onClick={() => step(-1)}
            color="secondary"
            shape="circle"
            disabled={atStart}
          >
            <FaChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            aria-label="Next blog"
            onClick={() => step(1)}
            color="secondary"
            shape="circle"
            disabled={atEnd}
          >
            <FaChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </PageHeader>
      <div
        ref={sectionRef}
        className="relative flex flex-col justify-center overflow-hidden"
      >
        <div
          ref={trackRef}
          className="flex gap-6"
          style={{
            width: 'max-content',
            paddingLeft: sidePadding,
            paddingRight: sidePadding
          }}
        >
          {blogs.map((blog) => (
            <div key={blog.id} className="shrink-0">
              <BlogCard blog={blog} width={cardWidth} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BlogContainer;
