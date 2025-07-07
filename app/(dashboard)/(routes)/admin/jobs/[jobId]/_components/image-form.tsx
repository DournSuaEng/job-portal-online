"use client";

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { ImageIcon, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import Image from 'next/image';
import ImageUpload from '@/components/image-upload';

interface ImageFormProps {
  initialData: {
    imageUrl: string;
    title: string;
  };
  jobId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, { message: "Image URL is required" }),
});

const ImageForm = ({ initialData, jobId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const { isSubmitting, isValid } = formMethods.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job updated successfully");
      router.refresh();
      setIsEditing(false);
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Cover Image
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? <>Cancel</> : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
        </Button>
      </div>

      {!isEditing && (!initialData.imageUrl ? (
        <div className="flex items-center justify-center h-60 bg-neutral-200 rounded-md">
          <ImageIcon className="h-10 w-10 text-neutral-500" />
        </div>
      ) : (
        <div className="relative w-full h-60 aspect-video mt-2">
          <Image
            alt="Cover Image"
            fill
            className="w-full h-full object-cover"
            src={initialData.imageUrl}
          />
        </div>
      ))}

      {isEditing && (
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={formMethods.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(url: string) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
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

export default ImageForm;
