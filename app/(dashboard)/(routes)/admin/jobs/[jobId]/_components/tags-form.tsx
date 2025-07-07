"use client";

import { Button } from "@/components/ui/button";
import getGenerateivAIResponse from "@/scripts/aistudio";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import axios from "axios";
import { Lightbulb, Loader2, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

// Props
interface TagsFormProps {
  initialData: Job;
  jobId: string;
}

// Validation Schema
const formSchema = z.object({
  tags: z.array(z.string()).min(1, "At least one tag is required"),
});

const TagsForm = ({ initialData, jobId }: TagsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const [jobTags, setJobTags] = useState<string[]>(initialData.tags || []);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { tags: initialData.tags || [] },
  });

  const { isSubmitting } = formMethods.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job updated successfully!");
      setIsEditing(false);
      setIsSaved(true);
      router.refresh();
    } catch {
      toast.error("Something went wrong! Please try again.");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);
      const customPrompt = `Generate an array of top 10 keywords related to the job profession "${prompt}". These keywords should encompass various aspects of the profession, including skills, responsibilities, tools, and technologies commonly associated with it. Aim for a diverse set of keywords that accurately represent the breadth of the profession. Your output should be a list/array of keywords. Just return me the array alone.`;

      const data = await getGenerateivAIResponse(customPrompt);
      const parsedData = JSON.parse(data);

      if (Array.isArray(parsedData)) {
        const uniqueTags = [...new Set([...jobTags, ...parsedData])];
        setJobTags(uniqueTags);
        formMethods.setValue("tags", uniqueTags);
      } else {
        toast.error("Invalid response from AI.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong...");
    } finally {
      setIsPrompting(false);
    }
  };

  const handleTagRemove = (index: number) => {
    const updatedTags = jobTags.filter((_, i) => i !== index);
    setJobTags(updatedTags);
    formMethods.setValue("tags", updatedTags);
  };

  const handleClearTags = () => {
    setJobTags([]);
    formMethods.setValue("tags", []);
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Tags
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? <>Cancel</> : <><Pencil className="w-4 h-4 mr-2" />Edit</>}
        </Button>
      </div>

      {!isEditing ? (
        <div className="flex items-center flex-wrap gap-2 mt-2">
          {jobTags.length > 0 ? (
            jobTags.map((tag, index) => (
              <div
                className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-200 text-black"
                key={index}
              >
                {tag}
              </div>
            ))
          ) : (
            <p>No Tags</p>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="e.g. 'Full-Stack Developer'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 rounded-md border"
            />
            {isPrompting ? (
              <Button>
                <Loader2 className="w-4 h-4 animate-spin" />
              </Button>
            ) : (
              <Button onClick={handlePromptGeneration}>
                <Lightbulb className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Note: Provide a profession name to generate tags
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {jobTags.length > 0 ? (
              jobTags.map((tag, index) => (
                <div
                  key={index}
                  className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-500 text-white"
                >
                  {tag}
                  <Button
                    variant="ghost"
                    className="p-0 h-auto"
                    onClick={() => handleTagRemove(index)}
                  >
                    <X className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
              ))
            ) : (
              <p>No Tags</p>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end mt-4">
            <Button variant="outline" type="button" onClick={handleClearTags}>
              Clear All
            </Button>
            <Button
              type="submit"
              onClick={formMethods.handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className={isSaved ? "border-pink-500 text-pink-500" : ""}
            >
              Save
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TagsForm;
