"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Validation schema
const formSchema = z.object({
  name: z.string().min(1, { message: "Company name cannot be empty" }),
});

const CompanyCreatePage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Request Body:", values);

      const response = await axios.post("/api/companies", values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data?.id) {
        router.push(`/admin/companies/${response.data.id}`);
        toast.success("Company Created");
      } else {
        toast.error("Failed to create company. Please try again.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error Response Data:", error.response?.data);
        toast.error(
          `Failed to create company: ${error.response?.data?.message || "Unknown error"}`
        );
      } else if (error instanceof Error) {
        console.error("Error Message:", error.message);
        toast.error("Failed to create company. Please try again.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-lg font-semibold">Name your company</h1>
        <p className="text-sm text-neutral-500">
          What would you like to name your Company? Don&apos;t worry, you can change this later.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g., 'Western Design Studio'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Name for this company.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Link href="/admin/jobs">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CompanyCreatePage;
