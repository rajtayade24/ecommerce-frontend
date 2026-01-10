import React from "react";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function MobileNumberInput({ mobile, setMobile }) {
  const countries = {
    IN: "+91",
  };

  return (
    <div>
      <label className="text-sm font-medium">Mobile number</label>

      <div className="flex gap-2">
        <Select defaultValue="IN">
          <SelectTrigger className="w-28 rounded-xl">
            <SelectValue placeholder="IN +91" />
          </SelectTrigger>

          <SelectContent>
            {Object.entries(countries).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {key} {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="text"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Mobile number"
          className="flex-1 rounded-xl"
          required
        />
      </div>
    </div>
  );
}
