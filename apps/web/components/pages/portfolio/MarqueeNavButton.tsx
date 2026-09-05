'use client';

import { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from '@repo/icons/fa';
import { Button } from '@repo/ui/components';
import gsap from 'gsap';

interface MarqueeNavButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
}

export const MarqueeNavButton = ({
  direction,
  onClick,
  disabled
}: MarqueeNavButtonProps) => {
  const iconRef = useRef<HTMLSpanElement>(null);
  const Icon = direction === 'prev' ? FaChevronLeft : FaChevronRight;
  const nudgeX = direction === 'prev' ? -3 : 3;

  const handleEnter = () => {
    if (disabled) return;
    gsap.to(iconRef.current, { x: nudgeX, duration: 0.25, ease: 'power2.out' });
  };
  const handleLeave = () => {
    gsap.to(iconRef.current, { x: 0, duration: 0.3, ease: 'power2.out' });
  };
  const handleClick = () => {
    gsap.fromTo(
      iconRef.current,
      { scale: 0.8 },
      { scale: 1, duration: 0.35, ease: 'back.out(3)' }
    );
    onClick();
  };

  return (
    <Button
      onClick={handleClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      shape="circle"
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous projects' : 'Next projects'}
    >
      <span ref={iconRef} className="inline-flex">
        <Icon className="size-4" />
      </span>
    </Button>
  );
};
