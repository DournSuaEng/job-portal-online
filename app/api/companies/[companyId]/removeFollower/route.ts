
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { companyId: string } }) => {
    try {
        // Authenticate the user and get their ID (synchronously)
        const { userId } = await auth(); // No need to await auth()

        // Destructure the companyId from params
        const { companyId } =await params;

        // Check if the user is authenticated
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if companyId is provided
        if (!companyId) {
            return new NextResponse("Company ID is required", { status: 400 });
        }




      const company = await db.company.findUnique({
        where: {
            id: companyId
        }
      })
      if(!company){
        return new NextResponse("Company Not Found", {status: 401})
      }
      // remove userid from the follower
      const userIndex = company?.followers.indexOf(userId)
      let updatedCompany
      if(userIndex !== 1){
        const updatedCompany = await db.company.update({
          where: {
            id: companyId,
            userId,
          },
          data : {
            followers : {
              set: company.followers.filter(followerId => followerId !== userId)
            }
          }
        
        })
        return new NextResponse(JSON.stringify(updatedCompany),{status: 200})
      }else{
        return new NextResponse("User Server Error", { status: 500})
      }
      
        // Return the updated company as JSON
        
    } catch (error) {
        // Log the error for debugging purposes
        console.error("[COMPANY_PATCH_ERROR]:", error);

        // Return a generic internal server error response
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};