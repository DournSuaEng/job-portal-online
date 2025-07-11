"use client "
import React, { useEffect, useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from '@/lib/utils';

interface AppliedFilter {
    value: string,
    label: string,
    checked? : boolean
}

interface CheckBoxContainerProps {
    data: AppliedFilter[];
    onChange: (dataValues :string[]) => void
}

const CheckBoxContainer = 
    ({data,onChange}:
     CheckBoxContainerProps) => {
    const [filters, setFilters] = useState<AppliedFilter[]>(data)

    useEffect (() => {
         setFilters(data)
    },[data])

    const handleCheckedChange = (applied: AppliedFilter)=> {
        const updatedFilters = filters.map(item => {
            if(item.value == applied.value){
                return{
                    ...item,
                    checked: !item.checked
                }
            }
            return item
        })
        setFilters(updatedFilters);
        
        onChange(
            updatedFilters.filter(item => item.checked).map(item=> item.value)
        )
    }

  return <div className=" flex w-full flex-col items-start justify-start gap-2">
    {filters.map(item => (
        <div key={item.value} className={cn("flex items-center gap-2", item.checked ? "text-purple-500 " : "text-muted-foreground")}>
            <Checkbox checked={ item.checked || false} onCheckedChange={() =>handleCheckedChange(item)}/>
            {item.label}
        </div>
    ))}
  </div>
}

export default CheckBoxContainer
