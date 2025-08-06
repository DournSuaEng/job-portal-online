import { Metadata } from "next";
import SearchContainer from "@/components/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import getJobs from "../../../../actions/get-jobs";
import CategoriesList from "./_components/categories-list";
import PageContent from "./_components/page-content";
import AppliedFilters from "./_components/applied-filters";

// Use this if all searchParams are optional
type SearchProps = {
  searchParams?: {
    title?: string;
    categoryId?: string;
    createdAtFilter?: string;
    shiftTiming?: string;
    workMode?: string;
    yearsOfExperience?: string;
  };
};

const SearchPage = async ({ searchParams = {} }: SearchProps) => {
  const {
    title = "",
    categoryId,
    createdAtFilter,
    shiftTiming,
    workMode,
    yearsOfExperience,
  } = searchParams;

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
        <CategoriesList categories={categories} />
        <AppliedFilters categories={categories} />
        <PageContent jobs={jobs} userId={userId} />
      </div>
    </>
  );
};

export default SearchPage;
