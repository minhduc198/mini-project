import { create } from "zustand";

type SidebarState = {
  isPinned: boolean;
  isHovering: boolean;
  setIsPinned: (v: boolean) => void;
  setIsHovering: (v: boolean) => void;
};

export const useSidebarControl = create<SidebarState>((set) => ({
  isPinned: true,
  isHovering: false,
  setIsPinned: (v) =>
    set({
      isPinned: v,
    }),
  setIsHovering: (v) => set({ isHovering: v }),
}));
