"use client";

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Job, Attachment } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { File, Pencil, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import AttachmentUpload from '@/components/attachments-upload';

interface AttachmentsFormProps {
  initialData: Job & { attachments: Attachment[] };
  jobId: string;
}

const formSchema = z.object({
  attachments: z.array(z.object({ url: z.string().url(), name: z.string() }))
});

const AttachmentsForm = ({ initialData, jobId }: AttachmentsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attachments: initialData?.attachments || []
    },
  });

  const { isSubmitting } = formMethods.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/jobs/${jobId}/attachment`, values);
      toast.success("Job attachments updated successfully");
      router.refresh();
      setIsEditing(false);
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const handleRemove = async (attachmentId: string, attachmentUrl: string) => {
    setDeletingId(attachmentId);

    try {
      await axios.delete(`/api/jobs/${jobId}/attachment/${attachmentId}`);
      formMethods.setValue(
        "attachments",
        formMethods.getValues("attachments").filter(att => att.url !== attachmentUrl)
      );
      toast.success("Attachment deleted successfully");
      router.refresh();
    } catch {
      toast.error("Failed to delete attachment");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Attachments
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? <>Cancel</> : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
        </Button>
      </div>

      {!isEditing && (
        <div className='space-y-2'>
          {initialData.attachments.map((file) => (
            <div key={file.id} className="flex items-center justify-between bg-purple-200 border p-2 rounded-md mt-2">
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
          ))}
        </div>
      )}

      {isEditing && (
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
            <FormField
              control={formMethods.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AttachmentUpload
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(attachments) => {
                        if (attachments) {
                          onSubmit({ attachments });
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </FormProvider>
      )}
    </div>
  );
};

export default AttachmentsForm;
