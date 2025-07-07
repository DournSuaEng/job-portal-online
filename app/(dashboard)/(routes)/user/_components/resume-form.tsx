"use client";

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { File, Pencil, X, Loader2, ShieldCheck, ShieldX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import AttachmentUpload from '@/components/attachments-upload';
import { Resumes, UserProfile } from '@prisma/client';
import { cn } from '@/lib/utils';

interface ResumeFormProps {
  initialData: UserProfile & { resumes: Resumes[] } | null;
  userId: string;
}

const formSchema = z.object({
  resumes: z.array(z.object({ url: z.string().url(), name: z.string() }))
});

const ResumeForm = ({ initialData, userId }: ResumeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isActiveResumeId, setIsActiveResumeId] = useState<string | null>(null);
  const router = useRouter();

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { resumes: initialData?.resumes || [] },
  });

  const { isSubmitting, isValid } = formMethods.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/users/${userId}/resumes`, values);
      toast.success("Resume updated successfully");
      router.refresh();
      setIsEditing(false);
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const handleRemove = async (resumeId: string, resumeUrl: string) => {
  
    try {
      setDeletingId(resumeId);
      if(initialData?.activeResumeId === resumeId){
        toast.error("Can't Delete the active resume")
        return;
      }
      await axios.delete(`/api/users/${userId}/resumes/${resumeId}`);
      const updatedResumes = formMethods.getValues("resumes").filter(r => r.url !== resumeUrl);
      formMethods.setValue("resumes", updatedResumes);
      toast.success("Resume deleted successfully");
      router.refresh();
    } catch {
      toast.error("Failed to delete resume");
    } finally {
      setDeletingId(null);
    }
  };

  const setActiveResume = async (resumeId: string) => {
    setIsActiveResumeId(resumeId);
    try {
      await axios.patch(`/api/users/${userId}`, {
        activeResumeId: resumeId,
      });
      toast.success('Resume activated');
      router.refresh();
    } catch {
      toast.error("Failed to activate resume");
    } finally {
      setIsActiveResumeId(null);
    }
  };

  return (
    <div className="mt-6 border flex-1 w-full bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Your Resume
        <Button onClick={() => setIsEditing(prev => !prev)} variant="ghost">
          {isEditing ? "Cancel" : (<><Pencil className="w-4 h-4 mr-2" /> Edit</>)}
        </Button>
      </div>

      {!isEditing && (
        <div className="space-y-2 mt-4">
          {initialData?.resumes.map((file) => (
            <div key={file.id} className="grid grid-cols-12 gap-2">
              <div className="flex items-center justify-between bg-purple-200 border p-2 rounded-md col-span-10">
                <File className="w-4 h-4 mr-2" />
                <span className="truncate w-4/5">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-1"
                  onClick={() => handleRemove(file.id, file.url)}
                  disabled={isSubmitting || deletingId === file.id}
                >
                  {deletingId === file.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div className="col-span-2 flex items-center justify-start gap-2">
                {isActiveResumeId === file.id ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center justify-center",
                      initialData.activeResumeId === file.id
                        ? "text-emerald-500"
                        : "text-red-500"
                    )}
                    onClick={() => setActiveResume(file.id)}
                  >
                    <p>
                      {initialData.activeResumeId === file.id ? "Live" : "Activate"}
                    </p>
                    {initialData.activeResumeId === file.id ? (
                      <ShieldCheck className="w-4 h-4 ml-2" />
                    ) : (
                      <ShieldX className="w-4 h-4 ml-2" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={formMethods.control}
              name="resumes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AttachmentUpload
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(resumes) => {
                        if (resumes) {
                          onSubmit({ resumes });
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
};

export default ResumeForm;
