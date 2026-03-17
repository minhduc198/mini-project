"use client";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSidebarControl } from "@/hooks/use-sidebar-control";
import { usePathname } from "next/navigation";

export default function Header() {
  const { isPinned, isHovering, setIsPinned } = useSidebarControl();
  // const isExpanded = isPinned || isHovering;
  const path = usePathname();

  return (
    <div className="flex justify-between px-6 py-4 border-b border-gray-200">
      <div className="flex gap-2 items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-[8px] border-0 xl:border border-gray-200"
          onClick={() => setIsPinned(!isPinned)}
        >
          <div className="flex flex-col gap-1">
            <span className="h-[2px] w-4 bg-muted-foreground rounded" />
            <span className="h-[2px] w-3 bg-muted-foreground rounded" />
            <span className="h-[2px] w-4 bg-muted-foreground rounded" />
          </div>
        </Button>
        <div className="text-xl font-bold">
          {path.split("/")[1]?.toUpperCase() || "DASHBOARD"}
        </div>
      </div>
    </div>
  );
}
