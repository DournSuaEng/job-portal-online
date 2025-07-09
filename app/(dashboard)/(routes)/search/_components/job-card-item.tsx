"use client";

import { Company, Job } from "@prisma/client";
import React, { useMemo, useState } from "react";
import { Card, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import Box from "@/components/box";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  Currency,
  Layers,
  Loader2,
  Network,
} from "lucide-react";
import { cn, formattedString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

// Custom truncate function
const truncateText = (text: string, length: number, omission = "...") => {
  return text.length <= length ? text : text.slice(0, length) + omission;
};

interface JobCardItemProps {
  job: Job & {
    company: Company | null;
    savedUsers?: string[];
    tags: string[];
    short_description?: string;
  };
  userId: string | null;
}

const experienceData = [
  { value: "0", label: "Fresher" },
  { value: "2", label: "0-2 years" },
  { value: "3", label: "2-4 years" },
  { value: "5", label: "5+ years" },
];

const JobCardItem: React.FC<JobCardItemProps> = ({ job, userId }) => {
  const router = useRouter();
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  const isSavedByUser = userId && job.savedUsers?.includes(userId) || false;
  const SavedUsersIcon = isSavedByUser ? BookmarkCheck : Bookmark;

  const formattedDate = useMemo(
    () => formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }),
    [job.createdAt]
  );

  const handleSaveJob = async () => {
    try {
      setIsBookmarkLoading(true);
      const endpoint = isSavedByUser
        ? `/api/jobs/${job.id}/removeJobFromCollection`
        : `/api/jobs/${job.id}/saveJobToCollection`;

      await axios.patch(endpoint);
      toast.success(isSavedByUser ? "Job Removed" : "Job Saved");
      router.refresh();
    } catch (error: unknown) {
      let errorMessage = "Failed to save job. Please try again.";

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = "Please log in to save jobs";
        }
        console.error(`Error saving job: ${error.message}`);
      } else if (error instanceof Error) {
        console.error(`Error saving job: ${error.message}`);
      } else {
        console.error("Error saving job: Unknown error");
      }

      toast.error(errorMessage);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const getExperienceLabel = (value: string) => {
    return experienceData.find((e) => e.value === value)?.label || "N/A";
  };

  return (
    <motion.div className="flex flex-col">
      <Card className="h-full">
        <div className="w-full h-full p-4 flex flex-col gap-y-2">
          {/* Top Row */}
          <Box className="justify-between">
            <p className="text-2xs text-muted-foreground">{formattedDate}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveJob}
              disabled={isBookmarkLoading}
              aria-label={isSavedByUser ? "Remove job from saved" : "Save job"}
            >
              {isBookmarkLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <SavedUsersIcon
                  className={cn(
                    "w-3 h-3",
                    isSavedByUser ? "text-emerald-500" : "text-muted-foreground"
                  )}
                />
              )}
            </Button>
          </Box>

          {/* Company Info */}
          <Box className="items-center gap-4">
            <div className="w-10 h-10 border p-2 rounded-md flex items-center justify-center overflow-hidden">
              {job.company?.logo ? (
                <Image
                  alt={job.company.name || "Company logo"}
                  src={job.company.logo}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xs text-gray-500">No Logo</span>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-stone-700 font-semibold text-sm truncate">
                {job.title}
              </p>
              {job.company?.id && job.company?.name && (
                <Link
                  href={`/companies/${job.company.id}`}
                  className="text-2xs text-purple-500 truncate block hover:underline"
                >
                  {job.company.name}
                </Link>
              )}
            </div>
          </Box>

          {/* Job Details */}
          <Box className="gap-2 flex-wrap">
            {job.shiftTiming && (
              <div className="text-2xs text-muted-foreground flex items-center">
                <BriefcaseBusiness className="w-2 h-2 mr-1" />
                {formattedString(job.shiftTiming)}
              </div>
            )}
            {job.workMode && (
              <div className="text-2xs text-muted-foreground flex items-center">
                <Layers className="w-2 h-2 mr-1" />
                {formattedString(job.workMode)}
              </div>
            )}
            {job.hourlyRate && (
              <div className="text-2xs text-muted-foreground flex items-center">
                <Currency className="w-2 h-2 mr-1" />
                {`${formattedString(job.hourlyRate)} $/hr`}
              </div>
            )}
            {job.yearsOfExperience && (
              <div className="text-2xs text-muted-foreground flex items-center">
                <Network className="w-2 h-2 mr-1" />
                {getExperienceLabel(job.yearsOfExperience)}
              </div>
            )}
          </Box>

          {/* Description */}
          {job.short_description && (
            <CardDescription className="text-2xs">
              {truncateText(job.short_description, 150)}
            </CardDescription>
          )}

          {/* Tags */}
          {job.tags?.length > 0 && (
            <Box className="flex-wrap gap-1">
              {job.tags.slice(0, 6).map((tag, i) => (
                <p
                  key={i}
                  className="bg-gray-100 text-2xs rounded-md px-1.5 py-[1px] font-semibold text-neutral-500"
                >
                  {tag}
                </p>
              ))}
            </Box>
          )}

          {/* Actions */}
          <Box className="flex-col gap-2 mt-auto w-full">
            <Link href={`/search/${job.id}`} className="w-full">
              <Button
                className="w-full border-purple-500 text-purple-500 hover:bg-purple-50 hover:text-purple-600 text-xs py-4"
                variant="outline"
                aria-label="View job details"
              >
                Details
              </Button>
            </Link>
            <Button
              className="w-full text-white bg-purple-800/90 hover:bg-purple-800 hover:text-white text-xs py-4"
              variant="outline"
              onClick={handleSaveJob}
              disabled={isBookmarkLoading}
              aria-label={isSavedByUser ? "Remove job from saved" : "Save job for later"}
            >
              {isBookmarkLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : isSavedByUser ? (
                "Saved"
              ) : (
                "Save For Later"
              )}
            </Button>
          </Box>
        </div>
      </Card>
      <Separator />
    </motion.div>
  );
};

export default JobCardItem;
