"use client";

import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import getGenerateivAIResponse from '@/scripts/aistudio';

import { zodResolver } from '@hookform/resolvers/zod';
import { Job } from '@prisma/client';
import axios from 'axios';
import { Lightbulb, Loader2, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface ShortDescriptionProps {
    initialData: Job;
    jobId: string;
}

const formSchema = z.object({
    short_description: z.string().min(1, "Short description cannot be empty."),
});

const ShortDescriptionForm = ({
    initialData,
    jobId,
}: ShortDescriptionProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [isPrompting, setIsPrompting] = useState(false);
    const router = useRouter();

    const formMethods = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            short_description: initialData?.short_description || "",
        },
    });

    const { isSubmitting, isValid } = formMethods.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/jobs/${jobId}`, values);
            toast.success("Job updated successfully!");
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong! Please try again.");
        }
    };

    const toggleEditing = () => setIsEditing((current) => !current);

    const handlePromptGeneration = async () => {
        try {
            setIsPrompting(true);
            const customPrompt = `Could you craft a concise job description for a ${prompt} position in fewer than 400 characters?`;
            const data = await getGenerateivAIResponse(customPrompt);

            formMethods.setValue("short_description", data, {
                shouldValidate: true, // Ensures the new value is validated
                shouldDirty: true,    // Marks the form as dirty
            });
            setIsPrompting(false);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while generating the description.");
            setIsPrompting(false);
        }
    };

    return (
        <div className="mt-6 border bg-neutral-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Job Short Description
                <Button onClick={toggleEditing} variant="ghost">
                    {isEditing ? <>Cancel</> : <><Pencil className="w-4 h-4 mr-2" />Edit</>}
                </Button>
            </div>

            {!isEditing && (
                <div className="my-2">
                    <p className="text-neutral-500">{initialData?.short_description || "No description available."}</p>
                </div>
            )}

            {isEditing && (
                <>
                    <div className="flex items-center gap-2 my-2">
                        <input
                            type="text"
                            placeholder="e.g. 'Full-Stack Developer'"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full p-2 rounded-md border"
                        />
                        {isPrompting ? (
                            <Button disabled>
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </Button>
                        ) : (
                            <Button onClick={handlePromptGeneration}>
                                <Lightbulb className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                        Note*: Provide a professional title to generate the description.
                    </p>

                    <FormProvider {...formMethods}>
                        <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                            <FormField
                                control={formMethods.control}
                                name="short_description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                disabled={isSubmitting}
                                                placeholder="Short description about the job"
                                                {...field}
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
                </>
            )}
        </div>
    );
};

export default ShortDescriptionForm;
