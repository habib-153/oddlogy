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
import { Upload, Image, X } from "lucide-react";
import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";

// Modern File Upload Component (same as AddCourseModal)
const ModernFileUpload = ({
  name,
  label,
  accept = "image/*",
  currentImage,
}: {
  name: string;
  label: string;
  accept?: string;
  currentImage?: string;
}) => {
  const { control } = useFormContext();
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ name, control });

  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    onChange(null);
    setPreview(currentImage || null);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Image className="w-4 h-4" />
        {label}
      </label>

      {!value ? (
        <div className="space-y-3">
          {/* Current Image Preview */}
          {currentImage && (
            <div className="relative bg-gray-50 rounded-xl p-4 border">
              <p className="text-xs text-gray-500 mb-2">Current image:</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border">
                  <img
                    src={currentImage}
                    alt="Current"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Current {label.toLowerCase()}
                  </p>
                  <p className="text-xs text-gray-500">Click below to change</p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Area */}
          <div className="relative">
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              title={`Upload ${label.toLowerCase()}`}
              aria-label={`Upload ${label.toLowerCase()}`}
            />
            <div
              className={`
                border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                ${
                  error
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-brand-primary/50 hover:bg-brand-primary/5"
                }
                cursor-pointer group
              `}
            >
              <Upload
                className={`w-8 h-8 mx-auto mb-3 transition-colors ${
                  error
                    ? "text-red-400"
                    : "text-gray-400 group-hover:text-brand-primary"
                }`}
              />
              <p
                className={`text-sm font-medium mb-1 ${
                  error ? "text-red-600" : "text-gray-700"
                }`}
              >
                {currentImage
                  ? `Change ${label.toLowerCase()}`
                  : `Click to upload ${label.toLowerCase()}`}
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-xl p-4 border border-brand-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {preview && (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                  {value.name || "New image selected"}
                </p>
                {value.size && (
                  <p className="text-xs text-gray-500">
                    {(value.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          {error.message}
        </p>
      )}
    </div>
  );
};

interface UpdateCourseModalProps {
  course: TCourse;
  onSuccess: () => void;
}

export default function UpdateCourseModal({
  course,
  onSuccess,
}: UpdateCourseModalProps) {
  const { toast } = useToast();
  const { mutate: updateCourse, isPending } = useUpdateCourse();
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
    intro_video: course.media?.intro_video || "",
  };

  const onSubmit = (data: any) => {
    // Extract files from form data
    const { banner, thumbnail, intro_video, ...courseData } = data;

    // Prepare submission data
    const submissionData = {
      ...courseData,
      ...(intro_video && {
        media: {
          intro_video: intro_video,
        },
      }),
      ...(banner && { banner }),
      ...(thumbnail && { thumbnail }),
    };

    updateCourse(
      { id: course._id!, courseData: submissionData },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Course updated successfully!",
          });
          onSuccess();
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error.response?.data?.message ||
              error.message ||
              "Failed to update course",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ODForm onSubmit={onSubmit} defaultValues={defaultValues}>
        <div className="space-y-8">
          {/* Course Information Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-brand-primary to-brand-accent rounded-full"></div>
              Course Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <ODInput
                  name="title"
                  label="Course Title"
                  placeholder="Enter course title"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <ODTextarea
                  name="description"
                  label="Course Description"
                  placeholder="Enter course description"
                  required
                />
              </div>

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
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
              Pricing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ODInput
                name="price"
                label="Regular Price"
                type="number"
                placeholder="Enter price in USD"
              />

              <ODInput
                name="salePrice"
                label="Sale Price (Optional)"
                type="number"
                placeholder="Enter discounted price"
              />
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
              Course Media
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ModernFileUpload
                name="banner"
                label="Course Banner"
                accept="image/*"
                currentImage={course.media?.banner}
              />

              <ModernFileUpload
                name="thumbnail"
                label="Course Thumbnail"
                accept="image/*"
                currentImage={course.media?.thumbnail}
              />

              <div className="md:col-span-2">
                <ODInput
                  name="intro_video"
                  label="Intro Video URL (Optional)"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="px-6 bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-primary-dark hover:to-brand-accent text-white"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Updating...
              </>
            ) : (
              "Update Course"
            )}
          </Button>
        </div>
      </ODForm>
    </div>
  );
}