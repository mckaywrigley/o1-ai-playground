"use client";

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";

interface ModelSelectProps {
  model: "o1-preview" | "o1-mini";
  onSelect: (model: "o1-preview" | "o1-mini") => void;
}

export default function ModelSelect({ model, onSelect }: ModelSelectProps) {
  const handleSelect = (value: "o1-preview" | "o1-mini") => {
    onSelect(value);
  };

  return (
    <Select
      value={model}
      onValueChange={handleSelect}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="o1-mini">o1 Mini</SelectItem>
        <SelectItem value="o1-preview">o1 Preview</SelectItem>
      </SelectContent>
    </Select>
  );
}
