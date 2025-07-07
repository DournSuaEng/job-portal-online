"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgeCheck, Ban, Loader, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

interface CellActionsProps {
 
  fullname: string;
  email: string;
}

const CellActions = ({  fullname, email }: CellActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRejection, setIsRejection] = useState(false);

  const sendSelected = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/sendSelected", {
        email,
        fullName: fullname,
      });

      toast.success("Mail Sent");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const sendRejected = async () => {
    setIsRejection(true);
    try {
      await axios.post("/api/SendRejection", {
        email,
        fullName: fullname,
      });

      toast.success("Mail Sent");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsRejection(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {isLoading ? (
          <DropdownMenuItem className="flex items-center justify-center">
            <Loader className="w-4 h-4 animate-spin" />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={sendSelected}
            className="flex items-center justify-center"
          >
            <BadgeCheck className="w-4 h-4 mr-2" />
            Selected
          </DropdownMenuItem>
        )}
        {isRejection ? (
          <DropdownMenuItem className="flex items-center justify-center">
            <Loader className="w-4 h-4 animate-spin" />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={sendRejected}
            className="flex items-center justify-center"
          >
            <Ban className="w-4 h-4 mr-2" />
            Rejected
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CellActions;
