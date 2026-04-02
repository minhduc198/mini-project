import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/src/components/ui/input";
import { get } from "react-hook-form";

interface TextFieldNumberProps {
  name: string;
  label: string;
  placeholder?: string;
}

export function TextFieldNumber({
  name,
  label,
  placeholder,
}: TextFieldNumberProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name)?.message;

  return (
    <div>
      <label className="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            type="number"
            placeholder={placeholder}
            value={field.value ?? ""}
            onChange={(e) =>
              field.onChange(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            className={`w-full bg-white/4 border rounded-lg px-3 py-2 text-xs text-white/80 placeholder-white/15
  focus:outline-none focus:bg-white/6 transition-colors
  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
  ${error ? "border-red-500/40 focus:border-red-500/60" : "border-white/[0.07] focus:border-violet-500/50"}`}
          />
        )}
      />
      {error && <p className="mt-1 text-[10px] text-red-400/80">{error}</p>}
    </div>
  );
}
