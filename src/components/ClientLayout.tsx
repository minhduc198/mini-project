"use client";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSidebarControl } from "@/src/hooks/use-sidebar-control";
import React from "react";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";
import QueryProvider from "../providers/queryProvider";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isPinned, isHovering } = useSidebarControl();
  const isExpanded = isPinned || isHovering;
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": isExpanded ? "290px" : "80px",
          "--sidebar-width-icon": "80px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />

      <Header />
      <SidebarInset className="mt-[76px] px-4 py-6">
        <main>
          <QueryProvider>{children}</QueryProvider>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
