"use client";

import { useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ImageIcon, Loader2, Trash2, UploadCloud } from "lucide-react";
import { UploadService } from "@/src/features/upload/api";
import Image from "next/image";

interface ImageUploadFieldProps {
  name: string;
  pathName?: string;
  label: string;
  handleUploading: (uploading: boolean) => void;
}

export function ImageUploadField({
  name,
  pathName,
  label,
  handleUploading,
}: ImageUploadFieldProps) {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;
  const currentUrl = watch(name) as string | undefined;
  const formPath = pathName
    ? (watch(pathName) as string | undefined)
    : undefined;

  const [uploadedPath, setUploadedPath] = useState<string | undefined>(
    formPath,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setIsUploading(true);
    handleUploading(true);

    try {
      let result;
      if (uploadedPath) {
        result = await UploadService.updateImage(file, uploadedPath);
      } else {
        result = await UploadService.uploadImage(file);
      }

      setUploadedPath(result.path);
      setValue(name, result.url, { shouldValidate: true, shouldDirty: true });
      if (pathName) {
        setValue(pathName, result.path, { shouldDirty: true });
      }
    } catch (err) {
      setPreview(currentUrl);
      console.error(err);
    } finally {
      setIsUploading(false);
      handleUploading(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  const handleRemove = async () => {
    if (uploadedPath) {
      try {
        await UploadService.deleteImage(uploadedPath);
      } catch (err) {
        console.error("Failed to delete", err);
      }
    }

    setUploadedPath(undefined);
    setPreview(undefined);
    setValue(name, "", { shouldValidate: true, shouldDirty: true });
    if (pathName) setValue(pathName, "", { shouldDirty: true });
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Controller
      name={name}
      control={control}
      render={() => (
        <div>
          <label className="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">
            {label}
          </label>

          {preview ? (
            <div className="relative group">
              <div
                className={`
                  relative w-full h-36 rounded-lg overflow-hidden border
                  ${error ? "border-red-500/40" : "border-white/[0.07]"}
                  bg-white/[0.04]
                `}
              >
                <Image
                  width={400}
                  height={400}
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-contain"
                />

                {!isUploading && (
                  <div
                    onClick={() => inputRef.current?.click()}
                    className="absolute inset-0 z-10 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 text-[11px] text-white/80">
                      <UploadCloud className="w-4 h-4" />
                      Change
                    </span>
                  </div>
                )}

                {!isUploading && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="absolute bottom-2 right-2 z-20 flex items-center gap-1 px-2 py-1 rounded-md
                      text-[10px] text-red-400 bg-black/60 hover:bg-red-500/20
                      opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                )}

                {isUploading && (
                  <div className="absolute inset-0 z-20 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                  </div>
                )}
              </div>

              {!isUploading && (
                <span className="block mt-1.5 text-[10px] text-white/25 truncate">
                  {currentUrl}
                </span>
              )}
            </div>
          ) : (
            <div
              onClick={() => !isUploading && inputRef.current?.click()}
              className={`
                flex flex-col items-center justify-center gap-2 w-full h-24 rounded-lg border
                cursor-pointer transition-colors
                ${
                  error
                    ? "border-red-500/40 bg-red-500/5"
                    : "border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.07] hover:border-violet-500/40"
                }
              `}
            >
              <ImageIcon className="w-6 h-6 text-white/20" />
              <span className="text-[11px] text-white/30">
                Click to upload image
              </span>
            </div>
          )}

          {error && <p className="mt-1 text-[10px] text-red-400/80">{error}</p>}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />
        </div>
      )}
    />
  );
}
