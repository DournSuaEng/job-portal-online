"use client";

import { Job } from "@prisma/client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import JobCardItem from "./job-card-item";
import { fadeInOut } from "@/animations";

interface PageContentProps {
  jobs: Job[];
  userId: string | null;
}

const PageContent = ({ jobs, userId }: PageContentProps) => {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-full max-w-md aspect-[4/3]">
          <Image
            fill
            alt="No jobs found"
            src="/img/file2.svg"
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={(e) => {
              e.currentTarget.src = "/img/fallback.png";
            }}
          />
        </div>
        <h2 className="mt-6 text-3xl font-semibold text-muted-foreground">
          No Jobs Found
        </h2>
      </div>
    );
  }

  return (
    <div className="pt-6">
      <AnimatePresence>
        <motion.div
          {...fadeInOut}
          layout
          className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-6 gap-2"
        >
          {jobs.map((job) => (
            <JobCardItem key={job.id} job={job as any} userId={userId} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageContent;
