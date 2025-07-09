import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import { ApplicantColumns, columns } from './_components/columns';
import { format } from 'date-fns';
import CustomBreadCrumb from '@/components/custom-bread-crumd';
import { DataTable } from '@/components/ui/data-table';
import Box from '@/components/box';

// ✅ Correctly define the expected props for the page
interface JobApplicantsPageProps {
  params: {
    jobId: string;
  };
}

const JobApplicantsPage = async ({ params }: JobApplicantsPageProps) => {
  const { userId } = await auth();

  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
      userId: userId as string,
    },
  });

  if (!job) {
    redirect("/admin/jobs");
  }

  const profiles = await db.userProfile.findMany({
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
   
    },
  });

  const filteredProfiles = profiles.filter((profile) =>
    profile.appliedJobs.some((appliedJob) => appliedJob.jobId === params.jobId)
  );

  const formattedProfiles: ApplicantColumns[] = filteredProfiles.map((profile) => {
    const appliedJob = profile.appliedJobs.find((job) => job.jobId === params.jobId);
    const resume = profile.resumes.find((res) => res.id === profile.activeResumeId);

    return {
      id: profile.userId,
      fullname: profile.fullName ?? '',
      email: profile.email ?? '',
      contact: profile.contact ?? '',
      appliedAt: appliedJob?.appliedAt
        ? format(new Date(appliedJob.appliedAt), 'MMM do, yyyy')
        : '',
      resume: resume?.url ?? '',
      resumeName: resume?.name ?? '',
    };
  });

  return (
    <div className="flex-col p-4 md:p-8 items-center justify-center">
      <Box>
        <CustomBreadCrumb
          breadCrumbPage="Applicants"
          breadCrumbItem={[
            { link: "/admin/jobs", label: "Jobs" },
            { link: "/admin/jobs", label: job.title ?? "" },
          ]}
        />
      </Box>

      <div className="mt-6 w-full">
        <DataTable
          columns={columns}
          data={formattedProfiles}
          searchKey="fullname"
        />
      </div>
    </div>
  );
};

export default JobApplicantsPage;
