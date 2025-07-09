"use client";

import Box from '@/components/box';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserProfile } from '@prisma/client';
import axios from 'axios';
import { Mail, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';


interface EmailFormProps {
  initialData: UserProfile | null;
  userId: string;
}

const formSchema = z.object({
  email: z.string().min(1),
});

const EamilForm = ({ initialData, userId }: EmailFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialData?.email || "");
  const router = useRouter();

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: name,
    },
  });

  const { isSubmitting, isValid } = formMethods.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/users/${userId}`, values);
      toast.success('Email updated');
      setName(values.email); // Update local state
      formMethods.reset(values); // Reset form with updated values
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error('Something went wrong!');
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <Box>
      {!isEditing && (
        <div
          className={cn(
            'text-lg mt-2 flex items-center gap-2',
            !name && 'text-neutral-500 italic'
          )}
        >
          <Mail className='w-6 h-6 mr-2 text-purple-500' />
          {name || 'No Email'}
        </div>
      )}

      {isEditing && (
        <FormProvider {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className='flex items-center gap-3 flex-1 mt-2'
          >
            <FormField
              control={formMethods.control}
              name='email'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Email-form '"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button disabled={!isValid || isSubmitting} type='submit'>
                Save
              </Button>
            </div>
          </form>
        </FormProvider>
      )}

      <Button onClick={toggleEditing} variant={'ghost'} className='mt-2'>
        {isEditing ? <>Cancel</> : (
          <>
            <Pencil className='h-4 w-4 mr-2' />Edit
          </>
        )}
      </Button>
    </Box>
  );
};

export default EamilForm;
