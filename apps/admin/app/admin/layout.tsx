import { SidebarProvider } from "@repo/ui/providers";
import SidebarServer from "components/common/navbar/Sidebar.server";
import Topbar from "components/common/navbar/Topbar";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarServer />
      <div className="flex min-h-svh flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}