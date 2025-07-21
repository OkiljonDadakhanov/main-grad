import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  icon?: ReactNode;
  error?: string;
  type?: string;
  placeholder?: string;
}

export function FormField({
  label,
  value,
  onChange,
  icon,
  error,
  type = "text",
  placeholder,
}: FormFieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-3 h-4 w-4 text-gray-500">
            {icon}
          </span>
        )}
        <Input
          className={icon ? "pl-10" : ""}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
