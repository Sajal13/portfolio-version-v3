"use client";

import { useEffect, useState } from "react";
import { SidebarTrigger } from "@repo/ui/components";
import { cn } from "@repo/ui/utils";

const Topbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <header className={cn(`sticky top-0 z-20 flex h-14 items-center justify-between border-b border-main  
      px-4 bg-body backdrop-blur-sm transition-all duration-300 ease-linear`, {
      'shadow-md bg-body/50': scrolled
    })}>
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        {/* logo shown here only on mobile since sidebar is a Sheet drawer */}
        <span className="text-base font-semibold md:hidden">YourLogo</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Profile navigator */}
        <button className="flex items-center gap-2 rounded-full p-1 hover:bg-secondary-500/10">
          <div className="size-8 rounded-full bg-neutral-300" />
        </button>
      </div>
    </header>
  );
};
export default Topbar;
