"use client";
import { useSidebarControl } from "@/src/hooks/use-sidebar-control";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

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
      <SidebarInset className="mt-[76px] px-4 py-6 min-w-0 overflow-hidden">
        <QueryClientProvider client={queryClient}>
          <main className="w-full min-w-0">{children}</main>
        </QueryClientProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
