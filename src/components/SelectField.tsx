import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

interface SelectFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  options: { label: string; value: string | number }[];
  valueType?: "string" | "number";
}

export function SelectField({
  name,
  label,
  placeholder = "Select…",
  options,
  valueType = "string",
}: SelectFieldProps) {
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
          <Select
            value={field.value?.toString() ?? ""}
            onValueChange={(v) => {
              if (v === "") return field.onChange(undefined);

              if (valueType === "number") {
                field.onChange(Number(v));
              } else {
                field.onChange(v);
              }
            }}
          >
            <SelectTrigger
              className={`w-full bg-white/[0.04] border rounded-lg px-3 py-2 text-xs text-white/80 h-auto
              ${
                error
                  ? "border-red-500/40"
                  : "border-white/[0.07] focus:border-violet-500/50"
              }`}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent className="bg-overlay border border-white/[0.08] rounded-xl shadow-2xl shadow-black/60 z-[210]">
              {options.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value.toString()}
                  className="text-xs text-white/70 focus:bg-white/[0.06]"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {error && <p className="mt-1 text-[10px] text-red-400/80">{error}</p>}
    </div>
  );
}
