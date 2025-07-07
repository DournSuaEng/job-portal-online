"use client"
 
import { cn } from '@/lib/utils'
import React from 'react'

interface BoxProps{
    children:React.ReactNode,
    className?:string 
}

const Box = ({children,className}: BoxProps) => {
  return (
    <div className={cn("flex items-center justify-between w-full ",className )}>
      {children}
    </div>
  )
}

export default Box
