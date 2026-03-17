/* eslint-disable @next/next/no-img-element */
"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useSidebarControl } from "@/hooks/use-sidebar-control";
import { cn } from "@/lib/utils";
import { Box, House, Package, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const sidebarItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    url: "/",
    icon: <House size={18} />,
  },
  {
    key: "customers",
    label: "Customers",
    url: "/customers",
    icon: <Users size={18} />,
  },
  {
    key: "product",
    label: "Products",
    url: "/products",
    icon: <Box size={18} />,
  },
  {
    key: "orders",
    label: "Orders",
    url: "/orders",
    icon: <Package size={18} />,
  },
];
export function AppSidebar() {
  const { isPinned, isHovering, setIsHovering } = useSidebarControl();
  const isExpanded = isPinned || isHovering;
  const router = useRouter();
  const path = usePathname();

  return (
    <Sidebar
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <SidebarHeader>
        <div
          className={cn("flex gap-2 items-center ", {
            "justify-center": !isExpanded,
          })}
        >
          <div className="w-12.5 h-12.5">
            <img src="/assets/images/logo.png" alt="logo" />
          </div>
          {isExpanded && <div className="text-xl font-bold ">Mini CRM</div>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup />

        <div
          className={cn("text-gray-600 text-sm", {
            "text-center": !isExpanded,
          })}
        >
          MENU
        </div>

        <div className="ml-4 mt-2 space-y-1 text-white">
          {sidebarItems.map((item) => (
            <div
              key={item.key}
              className={cn(
                "flex items-center gap-2 cursor-pointer rounded-[8px] px-2 py-1 text-white bg-primary/80 hover:bg-primary",

                {
                  "bg-primary":
                    path.replace("/", "") === item.url.replace("/", ""),
                },

                { "w-fit": !isExpanded },
              )}
              onClick={() => {
                router.push(item.url);
              }}
            >
              {item.icon}
              {isExpanded && (
                <span className="text-[16px] font-medium">{item.label}</span>
              )}
            </div>
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter>hello</SidebarFooter>
    </Sidebar>
  );
}
