"use client";

import { Resumes, UserProfile } from "@prisma/client";
import { useEffect, useState } from "react";
import Modal from "./modal";
import Box from "../box";
import Link from "next/link";
import { Button } from "./button";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  userProfile: (UserProfile & { resumes: Resumes[] }) | null;
}

const ApplyModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  userProfile,
}: ApplyModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isOpen) {
    return null;
  }

  if (!userProfile) {
    return (
      <Modal
        title="Error"
        description="User profile not found. Please try again later."
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="pt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  const activeResume = userProfile.resumes.find(
    (resume) => resume.id === userProfile.activeResumeId
  );

  const hasActiveResume = !!activeResume;

  return (
    <Modal
      title="Confirm Application"
      description="Please review your details. This action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      <Box>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="p-3 border rounded-md">{userProfile.fullName}</div>
          <div className="p-3 border rounded-md">{userProfile.contact}</div>
          <div className="p-3 border rounded-md col-span-1 sm:col-span-2">
            {userProfile.email}
          </div>
          <div className="p-3 border rounded-md col-span-1 sm:col-span-2 flex items-center gap-2">
            <span>Your Active Resume:</span>
            <span className="text-purple-600 truncate">
              {activeResume?.name || "No active resume selected"}
            </span>
          </div>
          <div className="col-span-1 sm:col-span-2 flex items-center justify-end text-sm text-muted-foreground">
            Change your details:
            <Link href="/user" className="text-purple-700 ml-2 hover:underline">
              over here
            </Link>
          </div>
        </div>
      </Box>
      <div className="pt-6 space-x-2 flex justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={loading || !hasActiveResume}
          variant="default" // Changed from "primary" to "default"
          onClick={onConfirm}
        >
          {loading ? "Submitting..." : "Continue"}
        </Button>
      </div>
    </Modal>
  );
};

export default ApplyModal;