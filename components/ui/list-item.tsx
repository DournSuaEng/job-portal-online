"use client";

import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { Check } from "lucide-react";

interface ListItemProps {
  category: Category;
  onSelect: (category: Category) => void;
  isChecked: boolean;
}

const ListItem = ({ category, onSelect, isChecked }: ListItemProps) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(category)}
      className={cn(
        "flex flex-wrap items-center w-full px-2 py-1.5 text-sm text-left hover:bg-accent hover:text-accent-foreground rounded-sm gap-4",
        isChecked && "bg-accent text-accent-foreground"
      )}
    >
      <Check
        className={cn(
          "mr-2 h-4 w-4",
          isChecked ? "opacity-100" : "opacity-0"
        )}
      />
      {category.name}
    </button>
  );
};

export default ListItem;