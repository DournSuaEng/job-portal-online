import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import { ApplicantColumns, columns } from './_components/columns';
import { format } from 'date-fns';
import CustomBreadCrumb from '@/components/custom-bread-crumd';
import { DataTable } from '@/components/ui/data-table';
import Box from '@/components/box';

const JobApplicantsPage = async ({ params }: { params: { jobId: string } }) => {
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

  const formattedProfiles: ApplicantColumns[] = filteredProfiles.map((profile) => ({
    id: profile.userId,
    fullname: profile.fullName ?? "",
    email: profile.email ?? "",
    contact: profile.contact ?? "",
    appliedAt: profile.appliedJobs.find((job) => job.jobId === params.jobId)?.appliedAt
      ? format(new Date(profile.appliedJobs.find((job) => job.jobId === params.jobId)?.appliedAt ?? ""), "MMM do, yyyy")
      : "",
    resume: profile.resumes.find((res) => res.id === profile.activeResumeId)?.url ?? "",
    resumeName: profile.resumes.find((res) => res.id === profile.activeResumeId)?.name ?? "",
  }));

  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center'>
      <Box>
        <CustomBreadCrumb
          breadCrumbPage='Applicants'
          breadCrumbItem={[
            { link: "/admin/jobs", label: "Jobs" },
            { link: "/admin/jobs", label: job.title ?? "" },
          ]}
        />
      </Box>

      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedProfiles}
          searchKey='fullname'
        />
      </div>
    </div>
  );
};

export default JobApplicantsPage;
