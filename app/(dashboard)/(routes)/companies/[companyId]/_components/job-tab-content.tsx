
"use client";

import { Job } from "@prisma/client";
import PageContent from "../../../search/_components/page-content";

interface JobTabContentProps{
    jobs: Job[]
    userId: string | null
}



const JobTabContent = ({jobs, userId}: JobTabContentProps) => {
  return <PageContent jobs={jobs} userId={userId}/>
}

export default JobTabContent
