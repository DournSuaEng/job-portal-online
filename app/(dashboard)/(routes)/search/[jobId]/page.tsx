// app/(dashboard)/(routes)/search/[jobId]/page.tsx
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import JobDetailsPageContent from './_components/job-details-page-content';
import getJobs from '@/actions/get-jobs';
import Box from '@/components/box';
import PageContent from '../_components/page-content';
import { Separator } from '@/components/ui/separator';

export default async function JobDetailsPage({ params }: { params: Promise<{ jobId: string }> }) {
  // Await the params object to access jobId
  const { jobId } = await params;

  const { userId } = await auth();

  if (!jobId) {
    redirect("/search");
  }

  const job = await db.job.findUnique({
    where: {
      id: jobId,
    },
    include: {
      company: true,
      attachments: true,
    },
  });

  if (!job) {
    redirect("/search");
  }

  const profile = await db.userProfile.findUnique({
    where: {
      userId: userId as string,
    },
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const jobs = await getJobs({}); // ✅ now includes company
  const filteredJobs = jobs.filter(
    (j) => j?.id !== job.id && j.categoryId === job.categoryId
  );

  return (
    <div className="flex-col p-4 md:p-8">
      <JobDetailsPageContent jobs={job} jobId={job.id} userProfile={profile} />
      {filteredJobs.length > 0 && (
        <>
          <Separator className="my-4" />
          <Box className="flex-col my-4 items-start justify-start px-4 gap-2">
            <h2 className="text-lg font-semibold">Related Jobs:</h2>
          </Box>
          <PageContent jobs={filteredJobs} userId={userId} />
        </>
      )}
    </div>
  );
}