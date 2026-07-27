"use client";

import { SidebarTrigger } from "@repo/ui/Sidebar";

const Topbar = () => {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-main bg-white px-4">
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
