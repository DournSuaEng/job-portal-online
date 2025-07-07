"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios, { AxiosError } from "axios"; // Import AxiosError
import toast from "react-hot-toast";

import Box from "@/components/box";
import CustomBreadCrumb from "@/components/custom-bread-crumd";
import Preview from "@/components/preview";
import ApplyModal from "@/components/ui/apply-modal";
import { Button } from "@/components/ui/button";
import Banner from "@/components/banner";

import { FileIcon } from "lucide-react";
import { Attachment, Company, Job, Resumes, UserProfile } from "@prisma/client";

interface JobDetailsPageContentProps {
  jobs: Job & { company: Company | null; attachments: Attachment[] };
  jobId: string;
  userProfile: (UserProfile & { resumes: Resumes[]; appliedJobs?: { jobId: string }[] }) | null;
  appliedJobIds?: string[];
}

const JobDetailsPageContent = ({
  jobs,
  jobId,
  userProfile,
  appliedJobIds = [],
}: JobDetailsPageContentProps) => {
  const router = useRouter();
  const [hasApplied, setHasApplied] = useState(appliedJobIds.includes(jobId));
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onApplied = async () => {
    if (!userProfile?.userId || !userProfile?.email || !userProfile?.fullName) {
      toast.error("User profile incomplete.");
      return;
    }

    setIsLoading(true);

    try {
      // Save job application
      await axios.patch(`/api/users/${userProfile.userId}/appliedJobs`, jobId);

      // Send thank you email
      await axios.post("/api/thankyou", {
        fullName: userProfile.fullName,
        email: userProfile.email,
      });

      toast.success("Successfully applied for the job!");
      setHasApplied(true);
    } catch (error: unknown) {
      // Type guard for AxiosError
      if (axios.isAxiosError(error)) {
        // Handle Axios-specific errors
        console.error("Apply error:", (error as AxiosError).response?.data);
      } else if (error instanceof Error) {
        // Handle generic errors
        console.error("Apply error:", error.message);
      } else {
        // Handle unexpected errors
        console.error("Apply error:", error);
      }
      toast.error("Something went wrong...");
    } finally {
      setOpen(false);
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <>
      <ApplyModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onApplied}
        loading={isLoading}
        userProfile={userProfile}
      />

      {hasApplied && (
        <Banner
          variant="success"
          label="Thank you for applying! Your application has been received and is under review."
        />
      )}

      <Box className="mt-4">
        <CustomBreadCrumb
          breadCrumbItem={[{ label: "Search", link: "/search" }]}
          breadCrumbPage={jobs?.title ?? ""}
        />
      </Box>

      <Box className="mt-4">
        <div className="w-full flex items-center h-72 relative rounded-md overflow-hidden">
          {jobs.imageUrl ? (
            <Image alt={jobs.title} src={jobs.imageUrl} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-purple-100 flex items-center justify-center">
              <h2 className="text-3xl font-semibold tracking-wider">{jobs.title}</h2>
            </div>
          )}
        </div>
      </Box>

      <Box className="mt-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-neutral-600">{jobs.title}</h2>
          {jobs.company && (
            <Link href={`/companies/${jobs.companyId}`} className="flex items-center gap-2">
              {jobs.company.logo && (
                <div className="relative w-6 h-6">
                  <Image
                    alt={jobs.company.name}
                    src={jobs.company.logo}
                    fill
                    className="object-contain rounded"
                  />
                </div>
              )}
              <span className="text-sm text-neutral-500">{jobs.company.name}</span>
            </Link>
          )}
        </div>

        <div className="mt-4">
          {userProfile ? (
            hasApplied ? (
              <Button
                variant="outline"
                className="text-sm text-purple-700 border-purple-500 hover:bg-purple-900 hover:text-white"
              >
                Already Applied
              </Button>
            ) : (
              <Button
                className="text-sm bg-purple-700 hover:bg-purple-900"
                onClick={() => setOpen(true)}
              >
                Apply
              </Button>
            )
          ) : (
            <Link href="/user">
              <Button className="text-sm px-8 bg-purple-700 hover:bg-purple-900">Update Profile</Button>
            </Link>
          )}
        </div>
      </Box>

      <Box className="flex-col my-4 items-start justify-start px-4 gap-2">
        <h2 className="text-lg font-semibold">Description:</h2>
        <p className="font-sans">{jobs?.short_description}</p>
      </Box>

      {jobs?.description && (
        <Box>
          <Preview model={jobs.description} />
        </Box>
      )}

      {jobs.attachments.length > 0 && (
        <Box className="flex-col my-4 items-start justify-start px-4 font-sans">
          <h2 className="text-lg font-semibold">Attachments:</h2>
          <p>Download the attachments to know more about the job.</p>
          <div className="space-y-3 mt-2">
            {jobs.attachments.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                target="_blank"
                download
                className="flex items-center gap-2 text-purple-500"
              >
                <FileIcon className="w-4 h-4" />
                <p>{item.name}</p>
              </Link>
            ))}
          </div>
        </Box>
      )}
    </>
  );
};

export default JobDetailsPageContent;