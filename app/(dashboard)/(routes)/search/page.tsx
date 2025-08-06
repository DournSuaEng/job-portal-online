// app/(dashboard)/(routes)/search/page.tsx
import { SpeedInsights } from "@vercel/speed-insights/next";
import SearchContainer from "@/components/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import getJobs from "../../../../actions/get-jobs";
import CategoriesList from "./_components/categories-list";
import PageContent from "./_components/page-content";
import AppliedFilters from "./_components/applied-filters";

// ✅ Optional metadata
export const metadata = {
  title: "Search Jobs",
  description: "Browse and filter jobs that match your preferences.",
};

// ✅ Correct PageProps type for App Router
type PageProps = {
  params: Promise<Record<string, never>>; // Empty object wrapped in Promise
  searchParams: Promise<{
    title?: string;
    categoryId?: string;
    createdAtFilter?: string;
    shiftTiming?: string;
    workMode?: string;
    yearsOfExperience?: string;
  }>;
};

// ✅ Final Component
const SearchPage = async ({ params, searchParams }: PageProps) => {
  // Await params (unused, but required)
  await params;

  // Await searchParams before destructuring
  const {
    title = "",
    categoryId,
    createdAtFilter,
    shiftTiming,
    workMode,
    yearsOfExperience,
  } = await searchParams;

  const categories = await db.category.findMany({
    orderBy: {
      name: "desc",
    },
  });

  const { userId } = await auth();

  const jobs = await getJobs({
    title,
    categoryId,
    createdAtFilter,
    shiftTiming,
    workMode,
    yearsOfExperience,
  });

  return (
    <>
      <div className="px-6 pt-6 block md:hidden md:mb-0">
        <SearchContainer />
      </div>
      <div className="p-6">
        {/* Categories */}
        <CategoriesList categories={categories} />

        {/* Applied Filters */}
        <AppliedFilters categories={categories} />

        {/* Page Content */}
        <PageContent jobs={jobs} userId={userId} />

        {/* Add SpeedInsights for performance monitoring */}
        <SpeedInsights />
      </div>
    </>
  );
};

export default SearchPage;