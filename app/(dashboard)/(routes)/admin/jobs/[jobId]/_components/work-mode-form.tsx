"use client";

import { Button } from '@/components/ui/button';
import ComboBox from '@/components/ui/combo-box';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Job } from '@prisma/client';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface WorkModFormProps { 
    initialData: Job
    jobId: string;
   
}
const options = [
    {
        value: "remote",
        label: "Remote",
    },
    {
        value: "hybrid",
        label: "Hybrid",
    },
    {
        value: "office",
        label: "Office",
    },
];


const formSchema = z.object({
    workMode: z.string().min(1),
});

const WorkModeForm = ({
     initialData, 
     jobId

    }: WorkModFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const formMethods = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            workMode: initialData?.workMode || ""
        },
    });

    const { isSubmitting, isValid } = formMethods.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
       try {
         await axios.patch(`/api/jobs/${jobId}`, values)
        toast.success("Job Update")
        setIsEditing(false)
        router.refresh();
       } catch {
        toast.error("Something went wrong!")
       }
    };

    const toggleEditing = () => setIsEditing((current) => !current);
    const selectedOption =options.find(
        option=>option.value===initialData.workMode)
    return (
        <div className="mt-6 border bg-neutral-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Job Work Mode
                <Button onClick={toggleEditing} variant={"ghost"}>
                    {isEditing ? <>Cancel</> : <><Pencil className="w-4 h-4 mr-2" />Edit</>}
                </Button>
            </div>

            {/* Display the title if not editing */}
            {!isEditing && (<p className={cn("text-sm mt-2",!initialData?.workMode && "text-neutral-500 italic")}>{selectedOption?.label|| "No Shift Timing add"}</p>)}
            {/* Display the input form in editing mode */}

            {isEditing && (
                <FormProvider {...formMethods}>
                    <form onSubmit={formMethods.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <FormField
                            control={formMethods.control}
                            name="workMode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <ComboBox 
                                        heading= "Work mode"
                                        options={options}
                                        {...field}
                                        
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={!isValid || isSubmitting} type="submit">Save</Button>
                        </div>
                    </form>
                </FormProvider>
            )}
        </div>
    );
};

export default WorkModeForm;
