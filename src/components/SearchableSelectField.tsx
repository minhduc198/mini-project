"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";

export interface SearchableOption {
  value: number | string;
  label: string;
  sub?: string;
  avatar?: string;
}

interface SearchableSelectProps {
  options: SearchableOption[];
  value?: number | string | null;
  onChange?: (v: number | string | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface SearchableSelectFieldProps {
  name: string;
  label: string;
  options: SearchableOption[];
  placeholder?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  disabled = false,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = query.trim()
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(query.toLowerCase()) ||
          o.sub?.toLowerCase().includes(query.toLowerCase()),
      )
    : options;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <Button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-2 bg-white/[0.04] border rounded-lg px-3 py-2 text-xs transition-colors text-left
          ${open ? "border-violet-500/50 bg-white/[0.06]" : "border-white/[0.07] hover:border-white/20"}
          ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {selected ? (
          <>
            {selected.avatar && (
              <Image
                width={20}
                height={20}
                src={selected.avatar}
                alt={selected.label}
                className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-white/10"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-white/80 truncate">{selected.label}</div>
              {selected.sub && (
                <div className="text-white/30 text-[10px] truncate">
                  {selected.sub}
                </div>
              )}
            </div>
          </>
        ) : (
          <span className="text-white/25 flex-1">{placeholder}</span>
        )}
        <ChevronDown
          size={12}
          className={`text-white/20 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </Button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-white/[0.08] bg-[#0F0F1C] shadow-2xl shadow-black/60 overflow-hidden">
          <div className="p-2 border-b border-white/[0.06]">
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20"
              />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg pl-7 pr-3 py-1.5 text-xs text-white/70 placeholder-white/20 focus:outline-none focus:border-violet-500/40 transition-colors"
              />
            </div>
          </div>

          <div className="max-h-52 overflow-y-auto py-1 no-scrollbar">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-[11px] text-white/20">
                No results
              </div>
            ) : (
              filtered.map((opt) => {
                const isActive = opt.value === value;
                return (
                  <Button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange?.(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full bg-transparent flex items-center gap-2.5 px-3 py-2 text-xs transition-colors text-left
                      ${isActive ? "bg-violet-500/10 text-violet-300" : "text-white/60 hover:bg-white/[0.04] hover:text-white/80"}`}
                  >
                    {opt.avatar && (
                      <Image
                        width={20}
                        height={20}
                        src={opt.avatar}
                        alt={opt.label}
                        className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{opt.label}</div>
                      {opt.sub && (
                        <div className="text-[10px] text-white/25 truncate">
                          {opt.sub}
                        </div>
                      )}
                    </div>
                    {isActive && (
                      <Check size={12} className="text-violet-400 shrink-0" />
                    )}
                  </Button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function SearchableSelectField({
  name,
  label,
  options,
  placeholder,
}: SearchableSelectFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div>
      <label className="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <SearchableSelect
            options={options}
            value={field.value ?? null}
            onChange={(v) => field.onChange(v)}
            placeholder={placeholder}
          />
        )}
      />
      {error && <p className="mt-1 text-[10px] text-red-400/80">{error}</p>}
    </div>
  );
}
