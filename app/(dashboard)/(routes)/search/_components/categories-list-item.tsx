import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import qs from "query-string"

interface CategoriesListItemProps{
    label: string;
    value: string;
}



const CategoryListItem =({ label,value}: CategoriesListItemProps)=> {
  const pathname = usePathname();
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategoryId = searchParams.get("categoryId")
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value

  const onClick = () => {
  const url = qs.stringifyUrl({
    url: pathname,
      query: {
        title: currentTitle,
        categoryId: isSelected ? null : value
      }
     
  }, {skipNull: true , skipEmptyString : true}

);
  router.push(url);
};

  return (<Button type="button" onClick={onClick} variant={"outline"} className ={cn("whitespace-nowrap text-sm   tracking-wider text-muted-foreground border px-2 py-[2px] rounded-md hover:bg-purple-600 hover:text-white transition cursor-pointer hover:shadow-md", isSelected && "bg-purple-700 text-white shadow-md")} >{label}</Button>)
}
export default CategoryListItem;