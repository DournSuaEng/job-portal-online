import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Building2, File, LayoutDashboard, ListCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import JobPublishAction from "./_components/job-publish-actions";
import Banner from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import TitleForm from "./_components/title-form";
import CategoryForm from "./_components/category-form";
import ImageForm from "./_components/image-form";
import ShortDescription from "./_components/short-description";
import ShiftTimingForm from "./_components/shift-timing-mode";
import HourlyRateForm from "./_components/hourly-rate.form";
import WorkModeForm from "./_components/work-mode-form";
import YearsOfExperienceForm from "./_components/work-experience-form";
import JobDescriptionForm from "./_components/job-description";
import TagsForm from "./_components/tags-form";
import CompanyForm from "./_components/company-form";
import AttachmentsForm from "./_components/attachments-form";

// Define the props type explicitly
interface PageProps {
  params: Record<string, string>;
  searchParams?: Record<string, string | string[]>;
}

const JobDetailsPage = async ({ params }: PageProps) => {
  const { jobId } = params; // Destructure directly from params

  // Verify the MongoDB ID
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdRegex.test(jobId)) {
    return redirect("/admin/jobs");
  }

  // Authenticate the user
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  // Fetch the job details
  const job = await db.job.findUnique({
    where: {
      id: jobId,
      userId,
    },
    include: {
      attachments: {
        orderBy: {
          createAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const companies = await db.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      createAt: "desc",
    },
  });

  if (!job) {
    return redirect("/");
  }

  // Compute completion details
  const requiredFields = [job.title, job.description, job.imageUrl, job.categoryId];
  const totalFields = requiredFields.length;
  const completionFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completionFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <Link href="/admin/jobs">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>
      {/* Title */}
      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Job Setup</h1>
          <span className="text-sm text-neutral-500">Complete All Fields {completionText}</span>
        </div>
        {/* action button */}
        <JobPublishAction jobId={jobId} isPublished={job.isPusblished} disabled={!isComplete} />
      </div>
      {/* warning before publishing the course */}
      {!job.isPusblished && (
        <Banner
          variant="warning"
          label="This job is unpublished. It will not be visible in the jobs list"
        />
      )}
      {/* container layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* left container */}
        <div>
          {/* title */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-600">Customize your job</h2>
          </div>
          {/* title form */}
          <TitleForm initialData={job} jobId={job.id} />
          {/* category form */}
          <CategoryForm
            initialData={job}
            jobId={job.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
          {/* Cover image form */}
          <ImageForm initialData={job} jobId={job.id} />
          {/* short description */}
          <ShortDescription initialData={job} jobId={job.id} />
          {/* shift timing mode */}
          <ShiftTimingForm initialData={job} jobId={job.id} />
          {/* hourly rate form */}
          <HourlyRateForm initialData={job} jobId={job.id} />
          {/* work mode */}
          <WorkModeForm initialData={job} jobId={job.id} />
          {/* years of experience */}
          <YearsOfExperienceForm initialData={job} jobId={job.id} />
        </div>
        {/* right container */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <IconBadge icon={ListCheck} />
              <h2 className="text-xl text-neutral-700">Job Requirement</h2>
            </div>
            <TagsForm initialData={job} jobId={job.id} />
          </div>
          {/* Company Detail */}
          <div>
            <div className="flex items-center gap-2">
              <IconBadge icon={Building2} />
              <h2 className="text-xl text-neutral-700">Company Detail</h2>
            </div>
            {/* company details */}
            <CompanyForm
              initialData={job}
              jobId={job.id}
              options={companies.map((company) => ({
                label: company.name,
                value: company.id,
              }))}
            />
          </div>
          {/* attachments */}
          <div>
            <div className="flex items-center gap-2">
              <IconBadge icon={File} />
              <h2 className="text-xl text-neutral-700">Job Attachments</h2>
            </div>
          </div>
          {/* attachment form */}
          <AttachmentsForm initialData={job} jobId={job.id} />
        </div>
        {/* description */}
        <div className="col-span-2">
          <JobDescriptionForm initialData={job} jobId={job.id} />
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;