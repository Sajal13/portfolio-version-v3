"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Button
} from "@repo/ui/components";
import { SidebarTooltip } from "components/layout/SidebarTooltip";
import { adminRoutes } from "data/navbar";

const SidebarClient = () => {
  const pathname = usePathname();
  const { open, isMobile } = useSidebar();
  const collapsedDesktop = !open && !isMobile;

  return (
    <Sidebar className="bg-neutral-800">
      <SidebarHeader>
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 overflow-hidden px-1"
        >
          <div className="size-8 shrink-0 rounded-md bg-primary-500" />
          <span
            className={
              collapsedDesktop ? "sr-only" : "truncate text-base font-semibold"
            }
          >
            YourLogo
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
                        className={("disabled:text-secondary/50")}
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
        <Button variant="filled" color="error">
          Log out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarClient;
