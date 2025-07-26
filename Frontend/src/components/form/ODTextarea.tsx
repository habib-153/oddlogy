"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

interface IProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export default function ODTextarea({
  name,
  label,
  placeholder,
  required = false,
  rows = 3,
  className,
}: IProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors?.[name];
  const hasError = !!error;

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>

      <Textarea
        id={name}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        rows={rows}
        className={cn(
          hasError && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
      />

      {hasError && (
        <p className="text-sm text-red-500 mt-1">{error.message as string}</p>
      )}
    </div>
  );
}
