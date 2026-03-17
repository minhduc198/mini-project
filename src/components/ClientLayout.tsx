"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSidebarControl } from "@/hooks/use-sidebar-control";
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
      <main className="w-full">
        <Header />
        <QueryProvider>{children}</QueryProvider>
      </main>
    </SidebarProvider>
  );
}
