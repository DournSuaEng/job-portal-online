import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { cn } from "@/lib/utils";
  import { ArrowUpDown, BadgeCheck, Ban, Eye, File, Loader, Loader2, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Cell } from '@tanstack/react-table';
import axios from 'axios';
import toast from 'react-hot-toast';

interface CellActionsProps {
    id : string;
    fullname: string;
    email: string;
}


const CellActions = ({id,fullname,email}:CellActionsProps) => {
    const [isLoading ,setIsLoading] = useState(false)
    const [isRejection , setIsRejection] = useState(false)

    const sendSelected = async () => {
        setIsLoading(true)
        try {
            await axios.post("/api/sendSelected", {
            email,
            fullName: fullname, // ✅ correct key
            });

            toast.success("Mail Sent")
            setIsLoading(false)
        } catch (error) {
         console.log(error)
         toast.error("something went wrong!")   
        }
    }

    const sendRejected = async () => {
        setIsLoading(true)
        try {
            await axios.post("/api/SendRejection", {
            email,
            fullName: fullname, // ✅ correct key
            });

            toast.success("Mail Sent")
            setIsLoading(false)
        } catch (error) {
         console.log(error)
         toast.error("something went wrong!")   
        }
    }
  return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}> <MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            {isLoading ? (
                <DropdownMenuItem className='flex items-center justify-center'>
                    <Loader className='w-4 h-4 animate-spin' />
                </DropdownMenuItem>
            ): (<DropdownMenuItem onClick={sendSelected}  className='flex items-center justify-center'>
                    <BadgeCheck className='w-4 h-4 mr-2'/>
                    Selected
                </DropdownMenuItem>)}
            {isRejection ? (
                <DropdownMenuItem className='flex items-center justify-center'>
                    <Loader className='w-4 h-4 animate-spin' />
                </DropdownMenuItem>
            ): (<DropdownMenuItem onClick={sendRejected} className='flex items-center justify-center'>
                    <Ban className='w-4 h-4 mr-2'/>
                    Rejected
                </DropdownMenuItem>)}
        </DropdownMenuContent>
        </DropdownMenu>
}

export default CellActions
