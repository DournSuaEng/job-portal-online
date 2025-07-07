import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";


type GetJobs ={
    title?: string;
    categoryId?: string;
    createdAtFilter?: string;
    shiftTiming?: string;
    workMode?:string;
    yearsOfExperience?: string;
    savedJobs?: boolean;
}
const getJobs = async ( 
    {
        title,
        categoryId,
        createdAtFilter,
        shiftTiming,
        workMode,
        yearsOfExperience,
        savedJobs

    }: GetJobs) :Promise<Job[]>=> {
    
    const {userId} =await auth();
    try {
        // initialize the query object with common options

        let query : any = {
            where: {
                isPusblished: true,
            },include: {
                company: true,
                category: true,
                attachments: true,
            },orderBy: {
                createdAt:"desc",
            }
        }

        if(typeof title !== "undefined" || typeof categoryId !== "undefined"){
            query.where = {
                AND : [
                    typeof title !== "undefined" && {
                        title : {
                            contains : title ,
                            mode : "insensitive",
                        }
                    },
                    typeof categoryId !== "undefined" && {
                        categoryId: {
                            equals: categoryId,
                        }
                    }

                ].filter(Boolean)
            }
        }
        // check whether the createdAtFilters is provided or not 
        if (createdAtFilter ){
            const currentDate = new Date();
            let startDate : Date;
            switch(createdAtFilter){
                case "today":
                    startDate = new Date(currentDate);
                    break;
                case "yesterday": 
                    startDate = new Date(currentDate);
                    startDate.setDate(startDate.getDate()-1 )
                    break;
                case "thisWeek":
                    startDate = new Date(currentDate);
                    startDate.setDate(startDate.getDate() -currentDate.getDay())// set the start date to the beginning of the current week
                    break;
                
                case "lastWeek":
                    startDate = new Date(currentDate);
                    startDate.setDate(startDate.getDate() -currentDate.getDay()-7)// set the start date to the beginning of the Previus week
                    break;
                case "thisMonth":
                    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    //set the start date to beginning of the current month
                    
                    break;
                default:
                    startDate = new Date(0);
                
            }
            //add the condition in query -(incluce)
            query.where.createdAt = {
                gte :startDate,
            }
        }
        // filter the data fetch the jobs based on the constructed
        let formattedShiftTiming = shiftTiming?.split(',')
        if(formattedShiftTiming && formattedShiftTiming.length > 0 ){
            query.where.shiftTiming={
                in: formattedShiftTiming,
            }
        }
        let formattedWorkingMode = workMode?.split(',')
        if(formattedWorkingMode && formattedWorkingMode.length > 0 ){
            query.where.workMode={
                in: formattedWorkingMode,
            }
        }
        let formattedYearExperience = yearsOfExperience?.split(',')
        if(formattedYearExperience && formattedYearExperience.length > 0 ){
            query.where.yearsOfExperience={
                in: formattedYearExperience,
            }
        }
        if(savedJobs){
            query.where.savedUsers= {
                has: userId,
            }
        }

        //execute the query fetch the jobs basd on the constructured paramters
        const jobs = await db.job.findMany(query);
        return jobs;
    } catch (error) {
        console.log("[GET_JOBS]:",error)
        return [];
    }
}
export default getJobs;