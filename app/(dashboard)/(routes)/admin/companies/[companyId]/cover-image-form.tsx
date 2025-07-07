"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import Image from "next/image";
import ImageUpload from "@/components/image-upload";


interface CompanyCoverImageFormProps {
    initialData: Company;
    companyId: string;
}

const formSchema = z.object({
    coverImage: z.string().min(1, { message: "Image URL is required" }),
});

const CompanyCoverImageForm = ({ initialData, companyId }: CompanyCoverImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const formMethods = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            coverImage: initialData?.coverImage || "", // ✅ Fixed incorrect property
        },
    });

    const { isSubmitting, isValid } = formMethods.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/companies/${companyId}`, values); // ✅ Fixed API endpoint
            toast.success("Cover image updated successfully!");
            router.refresh();
            setIsEditing(false);
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    const toggleEditing = () => setIsEditing((current) => !current);

    return (
        <div className="mt-6 border bg-neutral-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Cover Image
                <Button onClick={toggleEditing} variant="ghost">
                    {isEditing ? <>Cancel</> : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
                </Button>
            </div>

            {/* Display cover image if not editing */}
            {!isEditing && (
                !initialData.coverImage ? (
                    <div className="flex items-center justify-center h-60 bg-neutral-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-neutral-500" />
                    </div>
                ) : (
                    <div className="relative w-full h-60 mt-2">
                        <Image
                            alt="Cover Image"
                            src={initialData.coverImage}
                            layout="fill"
                            className="object-cover rounded-md"
                        />
                    </div>
                )
            )}

            {/* Show form when editing */}
            {isEditing && (
                <FormProvider {...formMethods}>
                    <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={formMethods.control}
                            name="coverImage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value}
                                            disabled={isSubmitting}
                                            onChange={(url: any) => field.onChange(url)} // ✅ Fixed field binding
                                            onRemove={() => field.onChange("")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={!isValid || isSubmitting} type="submit">
                                {isSubmitting ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            )}
        </div>
    );
};

export default CompanyCoverImageForm;
