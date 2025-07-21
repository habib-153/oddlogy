"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

interface IProps {
  variant?: "flat" | "bordered" | "faded" | "underlined";
  size?: "sm" | "md" | "lg";
  required?: boolean;
  type?: string;
  label: string;
  name: string;
  placeholder?: string;
  className?: string;
}

export default function ODInput({
  variant = "bordered",
  size = "md",
  required = false,
  type = "text",
  label,
  name,
  placeholder,
  className,
}: IProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors?.[name];
  const hasError = !!error;

  // Define size classes
  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-9 text-sm",
    lg: "h-10 text-base",
  };

  // Define variant classes
  const variantClasses = {
    flat: "border-0 bg-gray-100",
    bordered: "border border-input",
    faded: "border border-gray-200 bg-gray-50",
    underlined: "border-0 border-b border-gray-300 rounded-none bg-transparent",
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <Input
        id={name}
        type={type}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        className={cn(
          sizeClasses[size],
          variantClasses[variant],
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