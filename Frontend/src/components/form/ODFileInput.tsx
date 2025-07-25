"use client";

import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ODFileInputProps {
  name: string;
  label: string;
  accept?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function ODFileInput({
  name,
  label,
  accept = "image/*",
  placeholder,
  required = false,
  disabled = false,
  className,
}: ODFileInputProps) {
  const { control } = useFormContext();
  const {
    field: { onChange, value, ...field },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: required ? `${label} is required` : false },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onChange(file);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        {...field}
        id={name}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className={cn(
          "file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100",
          error && "border-red-500",
          className
        )}
      />
      {placeholder && !value && (
        <p className="text-sm text-gray-500">{placeholder}</p>
      )}
      {value && (
        <p className="text-sm text-green-600">Selected: {value.name}</p>
      )}
      {error && <span className="text-sm text-red-500">{error.message}</span>}
    </div>
  );
}
