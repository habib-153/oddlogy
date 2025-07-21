"use client";

import { useInstructors } from "@/hooks/instructor.hooks";
import { useAddCourse } from "@/hooks/courses.hook";
import { TCourse } from "@/types/course";
import { Button } from "@/components/ui/button";
import ODForm from "@/components/form/ODForm";
import ODInput from "@/components/form/ODInput";
import ODSelect from "@/components/form/ODSelect";
import ODTextarea from "@/components/form/ODTextarea";
import { useToast } from "@/hooks/use-toast";

interface AddCourseModalProps {
  onSuccess: () => void;
}

export default function AddCourseModal({ onSuccess }: AddCourseModalProps) {
  const { toast } = useToast();
  const { mutate: addCourse, isPending } = useAddCourse();
  const { data: instructors = [], isLoading: loadingInstructors } =
    useInstructors();

  const courseTypes = [
    { value: "free", label: "Free" },
    { value: "paid", label: "Paid" },
  ];

  const courseCategories = [
    { value: "HSC", label: "HSC" },
    { value: "Admission", label: "Admission" },
    { value: "Skill Development", label: "Skill Development" },
    { value: "Others", label: "Others" },
  ];

  const courseStatuses = [
    { value: "not-started", label: "Not Started" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const instructorOptions = instructors.map((instructor) => ({
    value: instructor._id,
    label: instructor.name,
  }));

  const onSubmit = (data: TCourse) => {
    addCourse(data, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Course created successfully!",
        });
        onSuccess();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to create course",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <ODForm onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <ODInput
            name="title"
            label="Course Title"
            placeholder="Enter course title"
            required
          />

          <ODTextarea
            name="description"
            label="Course Description"
            placeholder="Enter course description"
            required
          />

          <ODSelect
            name="courseCategory"
            label="Course Category"
            options={courseCategories}
            placeholder="Select category"
            required
          />

          <ODSelect
            name="courseType"
            label="Course Type"
            options={courseTypes}
            placeholder="Select type"
            required
          />

          <ODSelect
            name="instructor"
            label="Instructor"
            options={instructorOptions}
            placeholder={
              loadingInstructors ? "Loading..." : "Select instructor"
            }
            required
            disabled={loadingInstructors}
          />

          <ODSelect
            name="courseStatus"
            label="Course Status"
            options={courseStatuses}
            placeholder="Select status"
            required
          />
        </div>

        <div className="space-y-4">
          <ODInput name="price" label="Price" type="number" placeholder="0" />

          <ODInput
            name="salePrice"
            label="Sale Price"
            type="number"
            placeholder="0"
          />

          <ODInput
            name="studentEnrolled"
            label="Students Enrolled"
            type="number"
            placeholder="0"
          />

          <ODInput
            name="moduleCount"
            label="Module Count"
            type="number"
            placeholder="0"
            required
          />

          <ODInput
            name="media.banner"
            label="Banner URL"
            placeholder="https://example.com/banner.jpg"
          />

          <ODInput
            name="media.thumbnail"
            label="Thumbnail URL"
            placeholder="https://example.com/thumbnail.jpg"
          />

          <ODInput
            name="media.intro_video"
            label="Intro Video URL"
            placeholder="https://example.com/video.mp4"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Course"}
        </Button>
      </div>
    </ODForm>
  );
}
