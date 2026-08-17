'use client';

import { useEffect, useState } from 'react';
import { FaUser, FaKey, FaCog } from '@repo/icons/fa';
import { FiLogOut } from '@repo/icons/fi';
import { SidebarTrigger } from '@repo/ui/components';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel
} from '@repo/ui/components';
import { Separator } from '@repo/ui/components';
import { cn } from '@repo/ui/utils';

const Topbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChangePassword = () => {
    // navigate to change-password screen or open a modal
  };

  const handleSettings = () => {
    // navigate to settings page
  };

  const handleLogout = () => {
    // clear session / call logout endpoint
  };

  return (
    <header
      className={cn(
        `sticky top-0 z-20 flex h-14 items-center justify-between border-b border-main  
      px-4 bg-body backdrop-blur-sm transition-all duration-300 ease-linear`,
        {
          'shadow-md bg-body/50': scrolled
        }
      )}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <span className="text-base font-semibold md:hidden">
          Portfolio Admin
        </span>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu align="end">
          <DropdownMenuTrigger className="inline-flex size-9 items-center justify-center rounded-full border border-main cursor-pointer">
            <FaUser className="size-5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>

            <DropdownMenuItem onSelect={handleChangePassword}>
              <FaKey className="size-4" />
              Change Password
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={handleSettings}>
              <FaCog className="size-4" />
              Settings
            </DropdownMenuItem>

            <Separator className="my-1" />

            <DropdownMenuItem
              onSelect={handleLogout}
              className="text-red-500 hover:bg-red-500/10 hover:text-red-500 focus-visible:bg-red-500/10 focus-visible:text-red-500"
            >
              <FiLogOut className="size-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
export default Topbar;
