import Banner from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, ListCheck, Network } from "lucide-react";
import { redirect } from "next/navigation";

import Link from "next/link";
import CompanyName from "./name-form";
import CompanyDescriptionForm from "./description-form";
import LogoFrom from "./logo-form";
import CompanyLogoFrom from "./logo-form";
import CompanySocialContactsFrom from "./social-contacts-form";
import CompanyCoverImageForm from "./cover-image-form";
import CompanyOverviewFormForm from "./company-overview";
import WhyJoinUsFormForm from "./why-join-us-form";

const CompanyEditPage =async ({params}: {params: {companyId: string}})=>{

    const { companyId } = await params;
    
        // Verify the MongoDB ID
        const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!validObjectIdRegex.test(companyId)) {
            return redirect("/admin/companies");
        }
    
        // Authenticate the user
        const { userId } = await auth();
    if (!userId) {
        return redirect("/");
    }
    
        // Fetch the job details
        const company = await db.company.findUnique({
            where: {
                id: companyId,
                userId,
            },
        });
        const categories = await db.category.findMany({
            orderBy:{name: "asc"}
        })
    
        if (!company) {
            return redirect("/");
        }
    
        // Compute completion details
        const requiredFields = 
        [
         company.name,
         company.description, 
         company.logo,
         company.coverImage,
         company.mail,
         company.website,
         company.linkedIn,
         company.address_line_1,
         company.city,
         company.state,
         company.overview,
         company.whyJoinUs,
        ];
        const totalFields = requiredFields.length;
        const completionFields = requiredFields.filter(Boolean).length;
        const completionText = `(${completionFields}/${totalFields})`;
        const isComplete = requiredFields.every(Boolean);
 return (<div className="p-6">
    <Link href="/admin/companies">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
            <ArrowLeft className="w-4 h-4" />
            Back
        </div>
    </Link>
    {/* Title */}
    <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Job Setup</h1>
            <span className="text-sm text-neutral-500">Complete All Fields {completionText}</span>
        </div>
        {/* action button */}
        
    </div>
   
    {/* container layout */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/*  left container*/}
        <div>
            {/* title */}
            <div className="flex items-center gap-x-2">
                <IconBadge icon ={LayoutDashboard} />
                <h2 className="text-xl text-neutral-600">Coustomize your company</h2>
            </div>
           
            {/* name form */}
        <CompanyName initialData={company} companyId={company.id}/>
        {/* description form */}
        <CompanyDescriptionForm initialData={company} companyId={company.id}/>
        {/* company logo */}
        <CompanyLogoFrom initialData={company} companyId={company.id}/>
        </div>
        {/* right container */}
        <div className="space-y-6">
           <div>
            <div className="flex items-center gap-x-2">
                <IconBadge icon={Network}/>
                <h2 className="text-xl">Company Social Contacts</h2>
            </div>
            {/* social form */}
            <CompanySocialContactsFrom initialData={company} companyId={company.id}/>
            {/* Cover Image */}
            <CompanyCoverImageForm initialData={company} companyId={company.id}/>
           </div>
        </div>
        <div className="col-span-2">
        <CompanyOverviewFormForm initialData={company} companyId={company.id}/>
        </div>
        <div className="col-span-2">
        <WhyJoinUsFormForm initialData={company} companyId={company.id}/>
        </div>
    </div>
</div>)
}
export default CompanyEditPage;