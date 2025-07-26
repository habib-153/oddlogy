// Update: src/components/modules/AddModuleModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ODForm from "@/components/form/ODForm";
import ODInput from "@/components/form/ODInput";
import ODTextarea from "@/components/form/ODTextarea";
import ODSelect from "@/components/form/ODSelect";
import { Plus, PlayCircle, FileText, Hash, Link } from "lucide-react";
import { useAddModule } from "@/hooks/modules.hook";

interface AddModuleModalProps {
  courseId: string;
  onSuccess: () => void;
}

export default function AddModuleModal({
  courseId,
  onSuccess,
}: AddModuleModalProps) {
  const { toast } = useToast();
  const { mutate: addModule, isPending } = useAddModule();

  const statusOptions = [
    { value: "false", label: "In Progress" },
    { value: "true", label: "Completed" },
  ];

  const onSubmit = (data: any) => {
    const moduleData = {
      name: data.name,
      description: data.description,
      module_number: parseInt(data.module_number),
      video_url: data.video_url,
      course: courseId,
    };

    addModule(moduleData, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Module added successfully!",
        });
        onSuccess();
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description:
            error.response?.data?.message ||
            error.message ||
            "Failed to add module",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* Form */}
        <ODForm onSubmit={onSubmit}>
          <div className="space-y-4">
            {/* Module Number & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                  <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Hash className="w-4 h-4 text-blue-600" />
                  </div>
                  Module Number
                  <span className="text-red-500">*</span>
                </label>
                <ODInput
                  name="module_number"
                  label=""
                  type="number"
                  placeholder="1"
                  required
                  className="h-10"
                />
              </div>

              {/* <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                  <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                    <PlayCircle className="w-4 h-4 text-green-600" />
                  </div>
                  Status
                  <span className="text-red-500">*</span>
                </label>
                <ODSelect
                  name="isCompleted"
                  label=""
                  options={statusOptions}
                  required
                  className="h-10"
                />
              </div> */}
            </div>

            {/* Module Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                Module Name
                <span className="text-red-500">*</span>
              </label>
              <ODInput
                name="name"
                label=""
                placeholder="Enter module name"
                required
                className="h-10"
              />
            </div>

            {/* Module Description */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-orange-600" />
                </div>
                Module Description
                <span className="text-red-500">*</span>
              </label>
              <ODTextarea
                name="description"
                label=""
                placeholder="Describe what this module covers"
                required
                rows={3}
              />
            </div>

            {/* Video URL */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
                  <Link className="w-4 h-4 text-red-600" />
                </div>
                Video URL
                <span className="text-red-500">*</span>
              </label>
              <ODInput
                name="video_url"
                label=""
                placeholder="https://youtube.com/watch?v=..."
                required
                className="h-10"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 mt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onSuccess}
                className="flex-1 h-10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 h-10 bg-primary"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Module
                  </>
                )}
              </Button>
            </div>
          </div>
        </ODForm>
    </div>
  );
}