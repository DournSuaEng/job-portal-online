import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import { columns, CompanyColumns } from "./_components/columns"; // Import CompanyColumns from columns

const CompaniesOverviewPage = async () => {
  const { userId } = await auth();

  // Redirect to sign-in page if user is not authenticated
  if (!userId) {
    return redirect("/sign-in");
  }

  // Fetch companies from the database
  const companies = await db.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      createAt: "desc",
    },
  });

  // Format companies for the DataTable
  const formattedCompanies: CompanyColumns[] = companies.map((company) => ({
    id: company.id,
    name: company.name ?? "", // Use nullish coalescing for safety
    logo: company.logo ?? "",
    createdAt: company.createAt
      ? format(new Date(company.createAt), "MMM d, yyyy") // Correct date formatting
      : "N/A",
  }));

  return (
    <div className="p-6">
      <div className="flex items-end justify-end">
        <Link href="/admin/companies/create">
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            New Company
          </Button>
        </Link>
      </div>
      {/* DataTable - List of companies */}
      <div className="mt-6">
        <DataTable columns={columns} data={formattedCompanies} searchKey="name" />
      </div>
    </div>
  );
};

export default CompaniesOverviewPage;