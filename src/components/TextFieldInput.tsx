import { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/src/components/ui/input";

interface TextFieldInputProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  rightElement?: ReactNode;
}

export function TextFieldInput({
  name,
  label,
  placeholder,
  type = "text",
  rightElement,
}: TextFieldInputProps) {
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
      <div className="relative">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type={type}
              value={field.value ?? ""}
              placeholder={placeholder}
              className={`w-full bg-white/[0.04] border rounded-lg px-3 py-2 text-xs text-white/80 placeholder-white/15
                focus:outline-none focus:bg-white/[0.06] transition-colors
                ${rightElement ? "pr-9" : ""}
                ${error ? "border-red-500/40 focus:border-red-500/60" : "border-white/[0.07] focus:border-violet-500/50"}`}
            />
          )}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-[10px] text-red-400/80">{error}</p>}
    </div>
  );
}
