import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns, JobsColumns } from "./_components/columns";
import { DataTable } from "@/components/ui/data-table";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { format } from "date-fns";

const JobsPageOverview = async () => {
    const authData = auth();
    const userId = (await authData).userId;

    if (!userId) {
        return redirect("/");
    }

    const jobs = await db.job.findMany({
        where: { userId },
        include: {
            category: true,
            company: true,
            attachments: true, // ✅ Fix: Include attachments in the query
        },
        orderBy: { createdAt: "desc" },
    });

    const formattedJobs: JobsColumns[] = jobs.map((job) => ({
        id: job.id,
        title: job.title || "Untitled",
        company: job.company?.name || "N/A",
        category: job.category?.name || "N/A",
        isPusblished: job.isPusblished || false,
        createdAt: job.createdAt ? format(new Date(job.createdAt), "MMM do, yyyy") : "N/A",
        attachments: job.attachments || [],  // ✅ Fix: Ensures `attachments` is always an array
    }));

    return (
        <div className="p-6">
            <div className="flex items-end justify-end">
                <Link href={"/admin/create"}>
                    <Button>
                        <Plus className="w-5 h-5 mr-2" />
                        New Job
                    </Button>
                </Link>
            </div>
            {/* DataTable - List of jobs */}
            <div className="mt-6">
                <DataTable columns={columns} data={formattedJobs} searchKey="title" />
            </div>
        </div>
    );
};

export default JobsPageOverview;
