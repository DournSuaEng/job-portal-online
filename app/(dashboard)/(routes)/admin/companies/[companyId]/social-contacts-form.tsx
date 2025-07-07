"use client";

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Company } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Globe, Link as LinkIcon, Linkedin, Mail, MapPin, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';

interface CompanySocialContactsFormProps {
    initialData: Company;
    companyId: string;
}

const formSchema = z.object({
    mail: z.string().min(1, { message: "Mail is required" }).email("Invalid email format"),
    website: z.string().min(1, { message: "Website is required" }).url("Invalid URL format"),
    linkedIn: z.string().min(1, { message: "LinkedIn is required" }).url("Invalid URL format"),
    address_line_1: z.string().min(1, { message: "Address line 1 is required" }),
    address_line_2: z.string().optional(),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
    zipcode: z.string().min(1, { message: "Zipcode is required" }),
});

const CompanySocialContactsForm = ({ initialData, companyId }: CompanySocialContactsFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const formMethods = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mail: initialData?.mail || "",
            website: initialData?.website || "",
            linkedIn: initialData?.linkedIn || "",
            address_line_1: initialData?.address_line_1 || "",
            address_line_2: initialData?.address_line_2 || "",
            city: initialData?.city || "",
            state: initialData?.state || "",
            zipcode: initialData?.zipcode || "",
        },
    });

    const { isSubmitting, isValid } = formMethods.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/companies/${companyId}`, values);
            toast.success("Company updated successfully");
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    const toggleEditing = () => setIsEditing((current) => !current);

    return (
        <div className="mt-6 border bg-neutral-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Company Socials
                <Button onClick={toggleEditing} variant="ghost">
                    {isEditing ? "Cancel" : <><Pencil className="w-4 h-4 mr-2" />Edit</>}
                </Button>
            </div>

            {!isEditing ? (
                <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="col-span-3 space-y-2">
                        {initialData.mail && (
                            <div className="flex items-center text-sm text-neutral-500">
                                <Mail className="w-4 h-4 mr-2" />
                                {initialData.mail}
                            </div>
                        )}
                        {initialData.linkedIn && (
                            <Link href={initialData.linkedIn} target="_blank" className="flex items-center text-sm text-blue-600 hover:underline">
                                <Linkedin className="w-4 h-4 mr-2" />
                                {initialData.linkedIn}
                            </Link>
                        )}
                        {initialData.website && (
                            <Link href={initialData.website} target="_blank" className="flex items-center text-sm text-blue-600 hover:underline">
                                <Globe className="w-4 h-4 mr-2" />
                                {initialData.website}
                            </Link>
                        )}
                    </div>
                    <div className='col-span-3'>
                        {initialData.address_line_1 && (
                          <div className='flex items-center gap-2  text-blue-600 justify-start'>
                            <MapPin className='w-4 h-4 mt-1' />
                            <div>
                              <p className='text-sm text-muted-foreground '>
                                {initialData.address_line_1}, {initialData.address_line_2}
                              </p>
                              <p className='text-sm text-muted-foreground'>
                                {initialData.city}, {initialData.state}, {initialData.zipcode}
                              </p>
                            </div>
                          </div>
                        )}
                    </div>

                </div>
            ) : (
                <FormProvider {...formMethods}>
                    <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField control={formMethods.control} name="mail" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder="Email (e.g., sample@email.com)" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={formMethods.control} name="website" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder="Website URL" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={formMethods.control} name="linkedIn" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder="LinkedIn URL" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={formMethods.control} name="address_line_1" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea disabled={isSubmitting} placeholder="Address line 1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={formMethods.control} name="address_line_2" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea disabled={isSubmitting} placeholder="Address line 2 (optional)" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-3 gap-2">
                            <FormField control={formMethods.control} name="city" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder="City" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={formMethods.control} name="state" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder="State" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={formMethods.control} name="zipcode" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder="Zipcode" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <div className="flex items-center gap-x-2">
                            <Button disabled={!isValid || isSubmitting} type="submit">Save</Button>
                        </div>
                    </form>
                </FormProvider>
            )}
        </div>
    );
};

export default CompanySocialContactsForm;
