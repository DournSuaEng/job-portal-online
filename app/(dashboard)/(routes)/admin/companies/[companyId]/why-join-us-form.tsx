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
import { Company } from '@prisma/client';
import axios from 'axios';
import { Copy, Lightbulb, Loader2, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface WhyJoinUsFormProps {
    initialData: Company;
    companyId: string;
}

const formSchema = z.object({
    whyJoinUs: z.string().min(1, "Description is required.")
});

const WhyJoinUsFormForm = ({ initialData, companyId }: WhyJoinUsFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [rollname, setRollname] = useState("");
    const [skills, setSkills] = useState("");
    const [aiValue, setAiValue]= useState("")
    const [isPrompting, setIsPrompting] = useState(false);
    const router = useRouter();

    const formMethods = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            whyJoinUs: initialData?.whyJoinUs || "",
        },
    });

    const { isSubmitting, isValid } = formMethods.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/companies/${companyId}`, values);
            toast.success("company updated successfully!");
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong! Please try again.");
        }
    };

    const toggleEditing = () => setIsEditing((current) => !current);

    const handlePromptGeneration = async () => {
        try {
            setIsPrompting(true);
            const customPrompt = `Create a compelliing "Why join us" content piece for ${rollname}.Hightlight the unique opporturnities, benefits, and experiences that ${rollname} offers to its users. Emphasize the platform's value proposition, such as access to a vast music library, personalized recommendations, exclusive content, community features, and career opportunities for musicians and creator. Tailor the content to attract potential users and illustrate wh ${rollname} stands out among other music streaming platforms.`;

            const data = await getGenerateivAIResponse(customPrompt);
            const cleanedText = data.replace(/^'|'$/g, "").replace(/[\*\#]/g, "");

            // formMethods.setValue("description", cleanedText);
            setAiValue(cleanedText);
            setIsPrompting(false);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while generating the prompt.");
            setIsPrompting(false);
        }
    };

    const onCopy =()=> {
        navigator.clipboard.writeText(aiValue);
        toast.success("Copies ot clipboard");
    }

    return (
        <div className="mt-6 border bg-neutral-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Why Join Us
                <Button onClick={toggleEditing} variant="ghost">
                    {isEditing ? <>Cancel</> : <><Pencil className="w-4 h-4 mr-2" />Edit</>}
                </Button>
            </div>

            {!isEditing && (
                <div className={cn("text-sm mt-2", !initialData.overview && "text-neutral-500 italic")}>

                    {!initialData.whyJoinUs && "No Detial"} 
                    {initialData.whyJoinUs && (<Preview model={initialData.whyJoinUs} />)}
                   
                </div>
            )}

            {isEditing && (
                <>
                    <div className="flex items-center gap-2 my-2">
                        <input
                            type="text"
                            placeholder="e.g. 'Western Design Studioz'"
                            value={rollname}
                            onChange={(e) => setRollname(e.target.value)}
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
                    <p className="text-xs text-muted-foreground text-right">Note: Type the company name overhere to generate the whyJoinUs content</p>
                {aiValue&& (
                    <div className='w-full h-96 max-h-96 rounded-md bg-white overflow-y-scroll p-3 relative mt-4 text-muted-foreground'>{aiValue}
                    <Button className='absolute top-3 right-3 z-10' variant={"outline"} size={"icon"} onClick={onCopy}> 
                        <Copy className="w-4 h-4" />
                    </Button>
                    </div>
                )}
                    <FormProvider {...formMethods}>
                        <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                            <FormField
                                control={formMethods.control}
                                name="whyJoinUs"
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

export default WhyJoinUsFormForm;
