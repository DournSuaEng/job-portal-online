import SearchContainer from "@/components/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import getJobs from "../../../../actions/get-jobs";
import CategoriesList from "./_components/categories-list";
import PageContent from "./_components/page-content";
import AppliedFilters from "./_components/applied-filters";

type SearchParams = {
  title?: string;
  categoryId?: string;
  createdAtFilter?: string;
  shiftTiming?: string;
  workMode?: string;
  yearsOfExperience?: string;
};

type SearchProps = {
  searchParams?: Promise<SearchParams>;
};

const SearchPage = async ({ searchParams }: SearchProps) => {
  const params = await (searchParams ?? Promise.resolve({} as SearchParams));
  const {
    title = "",
    categoryId = "",
    createdAtFilter = "",
    shiftTiming = "",
    workMode = "",
    yearsOfExperience = "",
  } = params;

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
        {/* categories */}
        <CategoriesList categories={categories} />

        {/* applied filters */}
        <AppliedFilters categories={categories} />

        {/* page content */}
        <PageContent jobs={jobs} userId={userId} />
      </div>
    </>
  );
};

export default SearchPage;