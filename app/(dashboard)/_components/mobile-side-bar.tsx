import React from 'react'

import { Menu } from 'lucide-react';
import { Sidebar} from './sidebar';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
const MobileSideBar = () => {
  return (
  <Sheet>
  <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
    <Menu />
  </SheetTrigger>
  <SheetContent className="bg-white p-0 " side= "left">
    <SheetHeader>
      <SheetTitle>ONLINE JOB</SheetTitle>
      <SheetDescription >
      </SheetDescription>
    </SheetHeader>
    <Sidebar /> 
  </SheetContent>
</Sheet>
);

};

export default MobileSideBar
