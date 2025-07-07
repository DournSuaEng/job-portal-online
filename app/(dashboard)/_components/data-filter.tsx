"use client"
import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { usePathname, useRouter } from 'next/navigation';
import qs from "query-string"




const DataFilter = () => {
    
    const data = [
        {values: "today" , label: "Today"},
        {values: "yesterday" , label: "Yesterday"},
        {values: "thisWeek" , label: "This Week"},
        {values: "lastWeek" , label: "Last Week"},
        {values: "thisMonth" , label: "This Month"},

    ];

    const router = useRouter()
    const pathname = usePathname() 
    const onChange = (value: string) =>{
        const currentQueryParams =qs.parseUrl(window.location.href).query;
        const updatedQueryParams = {
            ...currentQueryParams,
            createdAtFilter : value
        }
        const url = qs.stringifyUrl({
            url: pathname,
            query: updatedQueryParams,
        },{
            skipNull: true ,
            skipEmptyString: true,
        })
        router.push(url)
    }
  return (
  <Select onValueChange={(selected) => onChange(selected)}>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Filter By Date" />
  </SelectTrigger>
  <SelectContent>
    {data.map(item => (
        <SelectItem 
        key={item.values}
        value={item.values}>
        {item.label}
        </SelectItem>
    ))}
  </SelectContent>
</Select>
  );
}

export default DataFilter
