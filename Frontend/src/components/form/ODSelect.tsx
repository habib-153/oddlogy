"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface IProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function ODSelect({
  name,
  label,
  options,
  placeholder,
  required = false,
  disabled = false,
  className,
}: IProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const error = errors?.[name];
  const hasError = !!error;
  const value = watch(name);

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <Select
        value={value || ""}
        onValueChange={(selectedValue) => setValue(name, selectedValue)}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            hasError && "border-red-500 focus:ring-red-500",
            className
          )}
        >
          <SelectValue
            placeholder={placeholder || `Select ${label.toLowerCase()}`}
          />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasError && (
        <p className="text-sm text-red-500 mt-1">{error.message as string}</p>
      )}
    </div>
  );
}
