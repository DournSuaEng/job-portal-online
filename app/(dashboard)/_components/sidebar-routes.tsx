"use client";

import { BookMarked, Compass, Home, List, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import SideBarRouteItem from "./side-bar-route-item";
import Box from "@/components/box";
import { Separator } from "@/components/ui/separator";
import DataFilter from "./data-filter";
import CheckBoxContainer from "./checkbox-container";
import qs from "query-string";

const adminRoutes = [
  {
    icon: List,
    label: "Job",
    href: "/admin/jobs",
  },
  {
    icon: List,
    label: "Companies",
    href: "/admin/companies",
  },
  {
    icon: Compass,
    label: "Analytics",
    href: "/admin/analytics",
  },
];

const guestRoutes = [
  {
    icon: Home,
    label: "Home",
    href: "/",
  },
  {
    icon: Compass,
    label: "Search",
    href: "/search",
  },
  {
    icon: User,
    label: "Profile",
    href: "/user",
  },
  {
    icon: BookMarked,
    label: "Saved Jobs",
    href: "/savedJobs",
  },
];

const shiftTimingData = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
];

const workingModesData = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "office", label: "Office" },
];

const experienceData = [
  { value: "0", label: "Fresher" },
  { value: "2", label: "0-2 years" },
  { value: "3", label: "2-4 years" },
  { value: "5", label: "5+ years" },
];

// Define the type of selected values for filters
type FilterValues = string[];

const SidebarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isAdminPage = pathname?.startsWith("/admin");
  const isSearchPage = pathname?.startsWith("/search");
  const routes = isAdminPage ? adminRoutes : guestRoutes;

  // Update the handlers to receive string[] instead of any[]
  const handleShiftTimingChange = (shiftTiming: FilterValues) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updatedQueryParams = {
      ...currentQueryParams,
      shiftTiming,
    };
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: updatedQueryParams,
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );
    router.push(url);
  };

  const handleWorkingMode = (workingModes: FilterValues) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updatedQueryParams = {
      ...currentQueryParams,
      workMode: workingModes,
    };
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: updatedQueryParams,
      },
      {
        skipNull: true,
        skipEmptyString: true,
        arrayFormat: "comma",
      }
    );
    router.push(url);
  };

  const handleExperience = (experience: FilterValues) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updatedQueryParams = {
      ...currentQueryParams,
      yearsOfExperience: experience,
    };
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: updatedQueryParams,
      },
      {
        skipNull: true,
        skipEmptyString: true,
        arrayFormat: "comma",
      }
    );
    router.push(url);
  };

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SideBarRouteItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
      {isSearchPage && (
        <Box className="px-4 py-4 items-start justify-start space-y-4 flex-col">
          <Separator />
          <h2 className="text-lg text-muted-foreground tracking-wide">Filters</h2>
          <DataFilter />
          <Separator />
          <h2 className="text-lg text-muted-foreground tracking-wide">
            Working Schedule
          </h2>
          <CheckBoxContainer data={shiftTimingData} onChange={handleShiftTimingChange} />
          <Separator />
          <h2 className="text-lg text-muted-foreground tracking-wide">Working Mode</h2>
          <CheckBoxContainer data={workingModesData} onChange={handleWorkingMode} />
          <Separator />
          <h2 className="text-lg text-muted-foreground tracking-wide">
            Working Experience
          </h2>
          <CheckBoxContainer data={experienceData} onChange={handleExperience} />
        </Box>
      )}
    </div>
  );
};

export default SidebarRoutes;
