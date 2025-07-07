"use client"
import { Company, Job } from '@prisma/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Preview from '@/components/preview';
import JobTabContent from './job-tab-content';



interface TabContentSectionProps {
  userId: string | null;
  company: Company;
  jobs: Job[];
}

const TabContentSection = ({ userId, company, jobs }: TabContentSectionProps) => {
  return (
    <div className="w-full my-4 mt-12">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-transparent shadow-none">
          <TabsTrigger
            value="overview"
            className="border-b-2 border-transparent data-[state=active]:border-purple-500 bg-transparent text-base font-sans tracking-wide"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="joinus"
            className="border-b-2 border-transparent data-[state=active]:border-purple-500 bg-transparent text-base font-sans tracking-wide"
          >
           why Join Us
          </TabsTrigger>
          <TabsTrigger
            value="jobs"
            className="border-b-2 border-transparent data-[state=active]:border-purple-500 bg-transparent text-base font-sans tracking-wide"
          >
            Jobs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
            {company.overview ? <Preview model={company.overview} />: ""}
        </TabsContent>
        <TabsContent value="joinus">
            {company.whyJoinUs ? <Preview model={company.whyJoinUs} />: ""}
        </TabsContent>
        <TabsContent value="jobs">
           <JobTabContent jobs={jobs} userId={userId}/>
        </TabsContent>
        
      </Tabs>
    </div>
  );
};

export default TabContentSection;
