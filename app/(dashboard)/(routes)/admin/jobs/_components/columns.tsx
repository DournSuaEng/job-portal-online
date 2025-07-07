"use client"

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/dist/client/link";
  

export type JobsColumns = {
 id: string;
 title: string;
 company: string;
 category: string;
 createdAt: string;
 isPusblished: boolean;
}

export const columns: ColumnDef<JobsColumns>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "isPusblished",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Published
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row})=> {
        const {isPusblished} = row.original;
        return(
            <div className={cn("border px-2 py-1 text-xs rounded-md w-24 text-center", isPusblished 
                ? "border-emerald-500 bg-100/80"
                : "border-red-500 bg-red-100/80"
                )}>{isPusblished ? "Published" : "Unpublished"}</div>
        )
    }
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "company",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({row})=>{
        const {id} = row.original;
        return (
                <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}> <MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <Link href ={`/admin/jobs/${id}`}>
            <DropdownMenuItem>
                <Pencil className="w-4 h-4 mr-2"/>Edit
            </DropdownMenuItem>
            </Link>
            <Link href ={`/admin/jobs/${id}/applicants`}>
            <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2"/>Applicants
            </DropdownMenuItem>
            </Link>
        </DropdownMenuContent>
        </DropdownMenu>

        )
    }
  },
]
