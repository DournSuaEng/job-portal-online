// app/(dashboard)/(routes)/admin/jobs/[jobId]/applicants/page.tsx
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import CustomBreadCrumb from '@/components/custom-bread-crumd';
import { DataTable } from '@/components/ui/data-table';
import Box from '@/components/box';
import { ApplicantColumns, columns } from './_components/columns';

// Define the props interface
interface JobApplicantsPageProps {
  params: Promise<{ jobId: string }>;
}

const JobApplicantsPage = async ({ params }: JobApplicantsPageProps) => {
  // Await the params since it's a Promise in Next.js App Router
  const { jobId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const job = await db.job.findUnique({
    where: {
      id: jobId,
      userId,
    },
  });

  if (!job) {
    redirect('/admin/jobs');
  }

  const profiles = await db.userProfile.findMany({
    include: {
      resumes: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      
    },
  });

  const filteredProfiles = profiles.filter((profile) =>
    profile.appliedJobs.some((appliedJob) => appliedJob.jobId === jobId)
  );

  const formattedProfiles: ApplicantColumns[] = filteredProfiles.map((profile) => ({
    id: profile.userId,
    fullname: profile.fullName ?? '',
    email: profile.email ?? '',
    contact: profile.contact ?? '',
    appliedAt: profile.appliedJobs[0]?.appliedAt
      ? format(new Date(profile.appliedJobs[0].appliedAt), 'MMM do, yyyy')
      : '',
    resume: profile.resumes.find((res) => res.id === profile.activeResumeId)?.url ?? '',
    resumeName: profile.resumes.find((res) => res.id === profile.activeResumeId)?.name ?? '',
  }));

  return (
    <div className="flex-col p-4 md:p-8 items-center justify-center">
      <Box>
        <CustomBreadCrumb
          breadCrumbPage="Applicants"
          breadCrumbItem={[
            { link: '/admin/jobs', label: 'Jobs' },
            { link: `/admin/jobs/${jobId}`, label: job.title ?? '' },
          ]}
        />
      </Box>

      <div className="mt-6 w-full">
        <DataTable columns={columns} data={formattedProfiles} searchKey="fullname" />
      </div>
    </div>
  );
};

export default JobApplicantsPage;