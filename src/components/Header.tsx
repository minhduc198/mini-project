/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import { cn } from "@/src/lib/utils";
import { useSidebarControl } from "@/src/hooks/use-sidebar-control";
import {
  ChevronDown,
  ChevronUp,
  CircleUser,
  Ellipsis,
  Headset,
  Info,
  LogOut,
  Search,
  Settings,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { useSidebar } from "./ui/sidebar";
import { Button } from "./ui/button";

export default function Header() {
  const { isPinned, isHovering, setIsPinned } = useSidebarControl();
  const [openMenu, setOpenMenu] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const isExpanded = isPinned || isHovering;
  const inputRef = useRef<HTMLInputElement>(null);
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
    router.push("/login");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCommandK =
        (e.metaKey && e.key.toLowerCase() === "k") ||
        (e.ctrlKey && e.key.toLowerCase() === "k");
      if (isCommandK) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setOpenMobile(true);
      setOpenMenu(false);
    }
    setIsPinned(!isPinned);
  };

  return (
    <div
      className={cn(
        "h-[64px] flex xl:flex-row flex-col items-start xl:items-center xl:ml-20  justify-between",
        "border-b border-white/6 fixed top-0 left-0 right-0",
        "bg-[#0C0C18]/95 backdrop-blur-md z-100 ",
        "transition-[margin] duration-300 ease-in-out",

        {
          "h-[152px] pb-3 border-0 ": openMenu,
          "xl:ml-[290px]": isExpanded,
        },
      )}
    >
      <div className="w-full flex items-center justify-between xl:justify-start gap-3 px-4 h-16 ">
        {isMobile && openMobile ? (
          <Button
            type="button"
            variant="ghost"
            className="w-9 h-9 flex items-center justify-center pointer-events-auto"
          >
            <X size={24} />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            onClick={toggleSidebar}
            className="h-9 w-9 rounded-lg border border-white/[0.08] bg-white/[0.04] flex flex-col gap-[5px] items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.07] transition-all"
          >
            <span className="h-[1.5px] w-4 bg-current rounded block" />
            <span className="h-[1.5px] w-3 bg-current rounded block" />
            <span className="h-[1.5px] w-4 bg-current rounded block" />
          </Button>
        )}

        <div className="relative w-95 hidden xl:flex">
          <Search
            size={14}
            className="text-white/25 absolute top-1/2 -translate-y-1/2 left-3.5 pointer-events-none"
          />

          <Input
            ref={inputRef}
            placeholder="Search or type command..."
            className={cn(
              "pl-10 pr-14 h-9 text-sm",
              "bg-white/[0.04] border-white/[0.08] text-white/60",
              "placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-violet-500/50",
              "rounded-lg",
            )}
          />
          <div className="flex absolute top-1/2 -translate-y-1/2 right-3 px-1.5 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] text-white/25 text-[10px] font-mono select-none">
            ⌘K
          </div>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow shadow-violet-500/30">
            <Zap size={13} className="text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">
            Mini CRM
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          className="flex xl:hidden h-9 w-9 rounded-lg border border-white/[0.08] bg-white/[0.04] items-center justify-center text-white/50 hover:text-white transition-colors"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <Ellipsis size={16} />
        </Button>
      </div>

      <div
        className={cn("w-full h-px bg-white/[0.06] flex xl:hidden", {
          hidden: !openMenu,
        })}
      />

      <div
        className={cn(
          "w-full hidden xl:flex items-center justify-between xl:justify-end",
          "gap-3 px-4 xl:h-[64px]",
          { flex: openMenu },
        )}
      >
        {mounted && (
          <DropdownMenu open={isOpenProfile} onOpenChange={setIsOpenProfile}>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors outline-none focus:outline-none h-auto"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-semibold">
                    N
                  </AvatarFallback>
                </Avatar>
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-medium text-white/80 leading-none">
                    Minh Duc
                  </p>
                  <p className="text-[10px] text-white/30 mt-0.5 leading-none">
                    Admin
                  </p>
                </div>
                {isOpenProfile ? (
                  <ChevronUp size={13} className="text-white/30" />
                ) : (
                  <ChevronDown size={13} className="text-white/30" />
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-[240px] rounded-xl border border-white/[0.08] bg-[#141420] shadow-xl shadow-black/50 p-2"
            >
              <div className="px-3 py-2.5 mb-1">
                <p className="text-sm font-medium text-white/80">
                  Nguyen Minh Duc
                </p>
                <p className="text-xs text-white/30 mt-0.5">
                  nguyenminhduc@gmail.com
                </p>
              </div>

              <DropdownMenuSeparator className="bg-white/[0.06]" />

              {[
                { icon: CircleUser, label: "Edit profile" },
                { icon: Settings, label: "Account settings" },
                { icon: Headset, label: "Support" },
              ].map(({ icon: Icon, label }) => (
                <DropdownMenuItem
                  key={label}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm text-white/50 hover:text-white/80 focus:bg-white/[0.04] focus:text-white/80"
                >
                  <Icon size={15} className="shrink-0" />
                  {label}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator className="bg-white/[0.06] my-1" />

              <DropdownMenuItem
                onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm text-rose-400/70 hover:text-rose-400 focus:bg-rose-500/[0.06] focus:text-rose-400"
              >
                <LogOut size={15} className="shrink-0" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
