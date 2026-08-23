'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiLogOut } from '@repo/icons/fi';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
  Button,
  useToast
} from '@repo/ui/components';
import { cn } from '@repo/ui/utils';
import { SidebarTooltip } from 'components/layout/SidebarTooltip';
import { adminRoutes } from 'data/navbar';

const SidebarClient = () => {
  const pathname = usePathname();
  const { open, isMobile } = useSidebar();
  const { toast } = useToast();
  const collapsedDesktop = !open && !isMobile;

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST'
      });
      if (res.ok) {
        toast({
          variant: 'success',
          title: 'Logged out successfully.'
        });

        window.location.href = '/login';
      } else {
        toast({
          variant: 'error',
          title: 'Logged out failed.'
        });
      }
    } catch (error) {
      toast({
        variant: 'error',
        title:
          error instanceof Error ? error.message : 'Failed to update order.'
      });
    }
  };

  return (
    <Sidebar className="bg-body">
      <SidebarHeader>
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 overflow-hidden px-1"
        >
          <Image
            src="/assets/image/logo.webp"
            alt="logo"
            width={36}
            height={36}
            className="rounded-md"
          />
          <span
            className={
              collapsedDesktop ? 'sr-only' : 'truncate text-base font-semibold'
            }
          >
            Portfolio Admin
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {adminRoutes.map((route) => {
              const Icon = route.icon;
              const active = pathname.startsWith(route.path);

              return (
                <SidebarMenuItem key={route.path}>
                  <SidebarTooltip label={route.label} active={collapsedDesktop}>
                    <Link href={route.path} className="block">
                      <SidebarMenuButton
                        isActive={active}
                        disabled={!route.active}
                        className={'disabled:text-secondary/50'}
                        icon={<Icon className="size-4.5 shrink-0" />}
                      >
                        {route.label}
                      </SidebarMenuButton>
                    </Link>
                  </SidebarTooltip>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarTooltip label="Log out" active={collapsedDesktop}>
          <Button
            variant="filled"
            color="error"
            className="w-full"
            onClick={handleLogout}
          >
            <FiLogOut className="size-4.5 shrink-0" />
            <span className={cn(open ? 'truncate' : 'sr-only')}>Log out</span>
          </Button>
        </SidebarTooltip>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarClient;
