"use client";

import { useInstructors } from "@/hooks/instructor.hooks";
import { useUpdateCourse } from "@/hooks/courses.hook";
import { TCourse } from "@/types/course";
import { Button } from "@/components/ui/button";
import ODForm from "@/components/form/ODForm";
import ODInput from "@/components/form/ODInput";
import ODSelect from "@/components/form/ODSelect";
import ODTextarea from "@/components/form/ODTextarea";
import { useToast } from "@/hooks/use-toast";

interface UpdateCourseModalProps {
  course: TCourse;
  onSuccess: () => void;
}

export default function UpdateCourseModal({
  course,
  onSuccess,
}: UpdateCourseModalProps) {
  const { toast } = useToast();
  const { mutate: updateCourse, isPending } = useUpdateCourse(course._id!);
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

  // Prepare default values for the form
  const defaultValues = {
    title: course.title,
    description: course.description,
    courseCategory: course.courseCategory,
    courseType: course.courseType,
    instructor:
      typeof course.instructor === "object"
        ? course.instructor._id
        : course.instructor,
    courseStatus: course.courseStatus,
    price: course.price,
    salePrice: course.salePrice,
    studentEnrolled: course.studentEnrolled,
    moduleCount: course.moduleCount,
    "media.banner": course.media?.banner || "",
    "media.thumbnail": course.media?.thumbnail || "",
    "media.intro_video": course.media?.intro_video || "",
  };

  const onSubmit = (data: TCourse) => {
    updateCourse(data, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Course updated successfully!",
        });
        onSuccess();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to update course",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <ODForm onSubmit={onSubmit} defaultValues={defaultValues}>
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
          {isPending ? "Updating..." : "Update Course"}
        </Button>
      </div>
    </ODForm>
  );
}
