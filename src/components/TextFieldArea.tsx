import { Controller, useFormContext } from "react-hook-form";

interface TextFieldAreaProps {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
}

export function TextFieldArea({
  name,
  label,
  placeholder,
  rows = 3,
}: TextFieldAreaProps) {
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
          <textarea
            {...field}
            value={field.value ?? ""}
            placeholder={placeholder}
            rows={rows}
            className={`w-full bg-white/[0.04] border rounded-lg px-3 py-2 text-xs text-white/80 placeholder-white/15
              focus:outline-none focus:bg-white/[0.06] transition-colors resize-none
              ${error ? "border-red-500/40 focus:border-red-500/60" : "border-white/[0.07] focus:border-violet-500/50"}`}
          />
        )}
      />
      {error && <p className="mt-1 text-[10px] text-red-400/80">{error}</p>}
    </div>
  );
}
