"use client";

import { z } from "zod";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { Pencil, ImageIcon } from "lucide-react";

import { Company } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import ImageUpload from "@/components/image-upload";

interface CompanyLogoFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  logo: z.string().min(1, { message: "Image URL is required" }),
});

const CompanyLogoForm = ({ initialData, companyId }: CompanyLogoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logo: initialData.logo || "",
    },
  });

  const { isSubmitting, isValid } = formMethods.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Logo updated successfully");
      router.refresh();
      setIsEditing(false);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Company Logo
        <Button onClick={() => setIsEditing(!isEditing)} variant="ghost">
          {isEditing ? "Cancel" : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        !initialData.logo ? (
          <div className="flex items-center justify-center h-60 bg-neutral-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-neutral-500" />
          </div>
        ) : (
          <div className="relative w-full h-60 aspect-video mt-2">
            <Image
              alt="Company Logo"
              src={initialData.logo}
              fill
              className="object-contain rounded-md"
            />
          </div>
        )
      ) : (
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={formMethods.control}
              name="logo"
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
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
};

export default CompanyLogoForm;
