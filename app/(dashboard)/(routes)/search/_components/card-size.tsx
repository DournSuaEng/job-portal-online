"use client";

import { Job, Company } from "@prisma/client";
import JobCardItem from "./job-card-item";

interface JobListProps {
  jobs: (Job & { company: Company | null; savedUsers?: string[] })[];
  userId: string | null;
}

const JobList = ({ jobs, userId }: JobListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
     {jobs.slice(0, 3).map((job) => (
  <JobCardItem key={job.id} job={job} userId={userId} />
))}

    </div>
  );
};

export default JobList;
