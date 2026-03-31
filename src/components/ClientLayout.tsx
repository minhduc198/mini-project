'use client';
import { useSidebarControl } from '@/src/hooks/use-sidebar-control';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';
import { AppSidebar } from './AppSidebar';
import Header from './Header';
import { SidebarInset, SidebarProvider } from './ui/sidebar';

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
          '--sidebar-width': isExpanded ? '290px' : '80px',
          '--sidebar-width-icon': '80px',
        } as React.CSSProperties
      }>
      <AppSidebar />

      <Header />
      <SidebarInset className="mt-[76px] px-4 py-6 min-w-0 overflow-hidden">
        <main className="w-full min-w-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
