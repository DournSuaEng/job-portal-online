
"use server"

import { utapi } from "@/server/delete";

const imageRemove=async(imageUrl: string | string[])=>{
    try {
        await utapi.deleteFiles(imageUrl)
        
        return{ success: true}
    } catch  {
        return { success: false}
    }
}
export default imageRemove;
