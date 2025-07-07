"use client";

import { Button } from "@/components/ui/button";
import { Category } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface AppliedFiltersProps {
  categories: Category[];
}

const AppliedFilters = ({ categories }: AppliedFiltersProps) => {
 
  const searchParams = useSearchParams();

  const currentParams = Object.fromEntries(searchParams.entries());

  const shiftTiming = currentParams.shiftTiming?.split(",") || [];
  const workModes = currentParams.workMode?.split(",") || [];
  const categoryId = currentParams.categoryId || null;
  const title = currentParams.title || "";

  const getCategoryName = (id: string | null) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : id;
  };

  if (!shiftTiming.length && !workModes.length && !categoryId && !title) {
    return null;
  }

  return (
    <>
      <div className="mt-4 flex items-center gap-4 flex-wrap">
        {shiftTiming.map((item) => (
          <Button
            key={`shift-${item}`}
            variant="outline"
            type="button"
            className="flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded-md bg-purple-50/80 border-purple-200 capitalize cursor-pointer hover:bg-purple-50"
          >
            {item}
          </Button>
        ))}

        {workModes.map((item) => (
          <Button
            key={`workmode-${item}`}
            variant="outline"
            type="button"
            className="flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded-md bg-purple-50/80 border-purple-200 capitalize cursor-pointer hover:bg-purple-50"
          >
            {item}
          </Button>
        ))}

        {categoryId && (
          <Button
            key={`category-${categoryId}`}
            variant="outline"
            type="button"
            className="flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded-md bg-purple-50/80 border-purple-200 capitalize cursor-pointer hover:bg-purple-50"
          >
            {getCategoryName(categoryId)}
          </Button>
        )}
      </div>

      {title && (
        <div className="flex items-center justify-center flex-col my-4">
          <h2 className="text-3xl text-muted-foreground">
            You searched for:{" "}
            <span className="font-bold text-neutral-800 capitalize">{title}</span>
          </h2>
        </div>
      )}
    </>
  );
};

export default AppliedFilters;
