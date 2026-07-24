import React from "react";
import { Label } from "@/components/ui/Label";

export function RequiredLabel({ children, required = false }) {
  return (
    <Label className="text-sm font-medium">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </Label>
  );
}
