/* eslint-disable @next/next/no-img-element */
'use client';

import { useSidebarControl } from '@/src/hooks/use-sidebar-control';
import { cn } from '@/src/lib/utils';
import { Box, House, Package, Users, Zap } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, useSidebar } from './ui/sidebar';

const sidebarItems = [
  { key: 'dashboard', label: 'Dashboard', url: '/', icon: <House size={16} /> },
  {
    key: 'customers',
    label: 'Customers',
    url: '/customers',
    icon: <Users size={16} />,
  },
  {
    key: 'product',
    label: 'Products',
    url: '/products',
    icon: <Box size={16} />,
  },
  {
    key: 'orders',
    label: 'Orders',
    url: '/orders',
    icon: <Package size={16} />,
  },
];

export function AppSidebar() {
  const { isPinned, isHovering, setIsHovering } = useSidebarControl();
  const { isMobile, setOpenMobile } = useSidebar();
  const isExpanded = isPinned || isHovering;
  const router = useRouter();
  const path = usePathname();

  const handleGoToPage = (url: string) => {
    router.push(url);
    setOpenMobile(false);
  };

  const isActive = (url: string) => path.replace('/', '') === url.replace('/', '');

  return (
    <Sidebar
      style={{ backgroundColor: '#0C0C18' }}
      className="border-r border-white/[0.06] !bg-[#0C0C18]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}>
      <SidebarHeader style={{ backgroundColor: '#0C0C18' }} className="px-4 py-5 !bg-[#0C0C18]">
        <div
          className={cn('flex items-center gap-2.5', {
            'justify-center': !isMobile && !isExpanded,
          })}>
          <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Zap size={15} className="text-white" />
          </div>
          {(isMobile || isExpanded) && <span className="text-[15px] font-semibold tracking-tight text-white shrink-0">Mini CRM</span>}
        </div>
      </SidebarHeader>

      <SidebarContent style={{ backgroundColor: '#0C0C18' }} className="px-3 !bg-[#0C0C18]">
        <SidebarGroup />

        <div
          className={cn('mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/20', { 'text-center': !isMobile && !isExpanded })}>
          {isExpanded || isMobile ? 'Menu' : 'Menu'}
        </div>

        <div className="space-y-0.5">
          {sidebarItems.map(item => {
            const active = isActive(item.url);
            return (
              <Button
                key={item.key}
                type="button"
                variant="ghost"
                onClick={() => handleGoToPage(item.url)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 h-auto font-normal justify-start',
                  active
                    ? 'bg-violet-500/15 text-white hover:bg-violet-500/15 hover:text-white'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]',
                  { 'justify-center px-2': !isMobile && !isExpanded },
                )}>
                <span className={cn('shrink-0 transition-colors', active ? 'text-violet-400' : 'text-current')}>{item.icon}</span>
                {(isMobile || isExpanded) && <span className="tracking-tight">{item.label}</span>}
                {active && (isMobile || isExpanded) && <div className="ml-auto w-1 h-4 rounded-full bg-violet-400" />}
              </Button>
            );
          })}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
