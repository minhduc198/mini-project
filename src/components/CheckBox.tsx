'use client';

import { cn } from '@/src/lib/utils';
import { Checkbox as CheckboxUI } from '@/src/components/ui/checkbox';
import type { MouseEvent } from 'react';

export function Checkbox({ checked, indeterminate, onChange }: { checked: boolean; indeterminate?: boolean; onChange: () => void }) {
  return (
    <CheckboxUI
      checked={indeterminate ? 'indeterminate' : checked}
      onCheckedChange={() => onChange()}
      onClick={(e: MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
      className={cn(
        'size-4 shrink-0 rounded border transition-colors',
        'after:hidden',
        'focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080810]',
        'border-white/20 bg-transparent hover:border-white/40',
        'data-[state=checked]:border-violet-500 data-[state=checked]:bg-violet-500 data-[state=checked]:text-white',
        'data-[state=indeterminate]:border-violet-500 data-[state=indeterminate]:bg-violet-500 data-[state=indeterminate]:text-white',
        'dark:border-white/20 dark:bg-transparent dark:data-[state=checked]:border-violet-500 dark:data-[state=checked]:bg-violet-500',
        'dark:data-[state=indeterminate]:border-violet-500 dark:data-[state=indeterminate]:bg-violet-500',
      )}
    />
  );
}
