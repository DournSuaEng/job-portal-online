import React from 'react';
import Box from '@/components/box';
import { auth, currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import NameForm from './_components/name-form';
import EmailForm from './_components/email-form'; // ✅ Fixed typo
import { db } from '@/lib/db';
import CustomBreadCrumb from '@/components/custom-bread-crumd';
import ContactForm from './_components/contact-form';
import ResumeForm from './_components/resume-form';
import AttachmentsForm from './_components/resume-form';
import { DataTable } from '@/components/ui/data-table';
import { AppliedJobsColumns, columns } from './_components/column';
import { format } from 'date-fns';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { truncate } from 'lodash';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Eye } from 'lucide-react';

const ProfilePage = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect('/sign-in');
  }

  // Fetch profile
  let profile = await db.userProfile.findUnique({
    where: {
      userId,
    },
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  const jobs = await db.job.findMany({
    where: {
      userId
    },
    include: {
      company: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  })
  const filterAppliedJobs = profile && profile?.appliedJobs.length > 0 ? jobs.filter((job)=>profile.appliedJobs.some((appliedJob) => appliedJob.jobId===job.id)).map (job => ({
    ...job,
    appliedAt: profile.appliedJobs.find(appliedJob => appliedJob.jobId === job.id)?.appliedAt
  })): [];
  
  const formattedJobs : AppliedJobsColumns[]= filterAppliedJobs.map(job=>({
    id: job.id,
    title: job.title,
    company: job.company ? job.company.name: "",
    category: job.category ? job.category?.name: "",
    appliedAt: job.appliedAt ? format(new Date(job.appliedAt), "MMM do, yyyy"): ""
  }))
  const followedCompanies = await db.company.findMany({
    where:{
      
        followers: {
          has: userId,
        },
    },
    orderBy: {
      createAt: "desc"
    }
  })
  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8">
      <Box>
        <CustomBreadCrumb breadCrumbPage="My Profile" />
      </Box>

      <Box className="w-full mt-8 flex flex-col space-y-6 rounded-md border p-4">
        {user?.hasImage && (
          <div className="relative h-24 w-24 aspect-square rounded-full shadow-md">
            <Image
              fill
              src={user.imageUrl}
              alt="User Profile Picture"
              className="object-cover rounded-full"
            />
          </div>
        )}
        {/* Ensure that profile is passed and not null */}
        <NameForm initialData={profile} userId={userId} />
        <EmailForm initialData={profile} userId={userId} />
        <ContactForm initialData={profile} userId={userId} />
        <ResumeForm initialData={profile} userId={userId} />
      </Box>
      {/* applied jobs list table */}
      <Box className='flex-col items-start justify-start mt-12'>
        <h2 className='text-2xl text-muted-foreground font-semibold'>
        Applied Jobs
        </h2>
        <div className='w-full mt-6'>
          <DataTable 
            columns={columns}
            searchKey="company"
            data={formattedJobs}
          />
        </div>
      </Box>
      <Box className='flex-col items-start justify-start mt-12'>
         <h2 className='text-2xl text-muted-foreground font-semibold'>
        Follow Companies
        </h2>
        <div className='mt-6 w-full grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 grayscale-25'>
            {followedCompanies.length ===0 ? (<p>No Compnaiies followed yet </p>):(<React.Fragment>{followedCompanies.map((com) => (
              <Card className = "p-3 space-y-2 relative" key={com.id}>
                <div className='w-full flex items-center justify-end'>
                  <Link href={`/companies/${com.id}`} >
                <Button variant={"ghost" } size={"icon"}><Eye className='w-4 h-4'/></Button>
                </Link>
                </div>
                {com.logo && (
                  <div className='w-full h-24 flex items-center justify-center relative overflow-hidden'>
                    <Image 
                      fill
                      alt="Logo"
                      src={com.logo}
                      className='object-contain w-full h-full'
                    />
                  </div>
                )}
                <CardTitle className='text-lg'>{com?.name}</CardTitle>
                {
                  com.description && (
                    <CardDescription>
                      {truncate(com?.description,{

                        length: 80,
                        omission: "..."
                      })}
                    </CardDescription>
                  )
                }
              </Card>
            ))}</React.Fragment>)}
        </div>
      </Box>
    </div>
  );
};

export default ProfilePage;
