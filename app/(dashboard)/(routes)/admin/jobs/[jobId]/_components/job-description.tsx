"use client";

import Editor from '@/components/editor';
import Preview from '@/components/preview';
import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form';

import { cn } from '@/lib/utils';
import getGenerateivAIResponse from '@/scripts/aistudio';

import { zodResolver } from '@hookform/resolvers/zod';
import { Job } from '@prisma/client';
import axios from 'axios';
import { Copy, Lightbulb, Loader2, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface JobDescriptionProps {
    initialData: Job;
    jobId: string;
}

const formSchema = z.object({
    description: z.string().min(1, "Description is required.")
});

const JobDescriptionForm = ({ initialData, jobId }: JobDescriptionProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [rollname, setRollname] = useState("");
    const [skills, setSkills] = useState("");
    const [aiValue, setAiValue] = useState("");
    const [isPrompting, setIsPrompting] = useState(false);
    const router = useRouter();

    const formMethods = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.short_description || "",
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
            toast.error("Something went wrong! Please try again.");
        }
    };

    const toggleEditing = () => {
        if (!isEditing) {
            formMethods.reset({
                description: initialData?.short_description || ""
            });
        }
        setIsEditing((current) => !current);
    };

    const handlePromptGeneration = async () => {
        try {
            setIsPrompting(true);
            const customPrompt = `Could you please draft a job requirements document for the position of ${rollname}? The job description should include roles & responsibilities, key features, and details about the role. The required skills should include proficiency in ${skills}. Additionally, you can list any optional skills related to the job. Thank you!`;

            const data = await getGenerateivAIResponse(customPrompt);
            const cleanedText = data.replace(/^'|'$/g, "").replace(/[\*\#]/g, "");

            setAiValue(cleanedText);
            formMethods.setValue("description", cleanedText); // Auto-fill the editor
            setIsPrompting(false);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while generating the prompt.");
            setIsPrompting(false);
        }
    };

    const onCopy = () => {
        navigator.clipboard.writeText(aiValue);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="mt-6 border bg-neutral-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Job Description
                <Button onClick={toggleEditing} variant="ghost">
                    {isEditing ? <>Cancel</> : <><Pencil className="w-4 h-4 mr-2" />Edit</>}
                </Button>
            </div>

            {!isEditing && (
                <div className={cn("text-sm mt-2", !initialData.description && "text-neutral-500 italic")}>
                    {!initialData.description && "No Description"}
                    {initialData.description && (<Preview model={initialData.description} />)}
                </div>
            )}

            {isEditing && (
                <>
                    <div className="flex items-center gap-2 my-2">
                        <input
                            type="text"
                            placeholder="e.g. 'Full-Stack Developer'"
                            value={rollname}
                            onChange={(e) => setRollname(e.target.value)}
                            className="w-full p-2 rounded-md border"
                        />
                        <input
                            type="text"
                            placeholder="Required Skills sets (comma separated)"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
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
                    <p className="text-xs text-muted-foreground text-right">Note: Profession Name & Required skills separated by commas</p>

                    {aiValue && (
                        <div className='w-full h-96 max-h-96 rounded-md bg-white overflow-y-scroll p-3 relative mt-4 text-muted-foreground'>
                            {aiValue}
                            <Button className='absolute top-3 right-3 z-10' variant={"outline"} size={"icon"} onClick={onCopy}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    <FormProvider {...formMethods}>
                        <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                            <FormField
                                control={formMethods.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Editor {...field} />
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

export default JobDescriptionForm;
