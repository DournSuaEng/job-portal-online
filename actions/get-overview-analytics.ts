import { db } from "@/lib/db";

export const getTotalJobsOnPortal = async () => {
  const jobs = await db.job.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return jobs.length;
};

export const getTotalJobsOnPortalByUserId = async (userId: string | null) => {
  if (!userId) {
    return 0;
  }

  const jobs = await db.job.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return jobs.length;
};

export const getTotalCompaniesOnPortal = async () => {
  const companies = await db.company.findMany({
    orderBy: {
      createAt: "desc", // Note: Make sure your DB field is named `createAt`, not `createdAt`
    },
  });

  return companies.length;
};

export const getTotalCompaniesOnPortalByUserId = async (userId: string | null) => {
  if (!userId) {
    return 0;
  }

  const companies = await db.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      createAt: "desc", // Same note as above
    },
  });

  return companies.length;
};

interface PieChartMonthlyCount {
  name: string;
  value: number;
}

export const getPieGraphicJobCreatedByUser = async (
  userId: string | null
): Promise<PieChartMonthlyCount[]> => {
  if (!userId) {
    return [];
  }

  const jobs = await db.job.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const currentYear = new Date().getFullYear();
  const monthLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const monthlyCount: PieChartMonthlyCount[] = monthLabels.map((month) => ({
    name: month,
    value: 0,
  }));

  const monthlyCountLookup: { [key: string]: PieChartMonthlyCount } = monthlyCount.reduce(
    (acc, item) => {
      acc[item.name] = item;
      return acc;
    },
    {} as { [key: string]: PieChartMonthlyCount }
  );

  jobs.forEach((job) => {
    const createdAt = new Date(job.createdAt);
    const month = createdAt.toLocaleDateString("default", { month: "short" });
    const year = createdAt.getFullYear();

    if (year === currentYear && monthlyCountLookup[month]) {
      monthlyCountLookup[month].value++;
    }
  });

  return monthlyCount;
};
export const getPieGraphicCompaniesCreatedByUser = async (
  userId: string | null
): Promise<PieChartMonthlyCount[]> => {
  if (!userId) {
    return [];
  }

  const companies = await db.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      createAt: "desc",
    },
  });

  const currentYear = new Date().getFullYear();
  const monthLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const monthlyCount: PieChartMonthlyCount[] = monthLabels.map((month) => ({
    name: month,
    value: 0,
  }));

  const monthlyCountLookup: { [key: string]: PieChartMonthlyCount } = monthlyCount.reduce(
    (acc, item) => {
      acc[item.name] = item;
      return acc;
    },
    {} as { [key: string]: PieChartMonthlyCount }
  );

  companies.forEach((company) => {
    const createdAt = new Date(company.createAt);
    const month = createdAt.toLocaleDateString("default", { month: "short" });
    const year = createdAt.getFullYear();

    if (year === currentYear && monthlyCountLookup[month]) {
      monthlyCountLookup[month].value++;
    }
  });

  return monthlyCount;
};
