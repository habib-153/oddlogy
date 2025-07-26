"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUpdateModule } from "@/hooks/modules.hook";
import ODForm from "@/components/form/ODForm";
import ODInput from "@/components/form/ODInput";
import ODTextarea from "@/components/form/ODTextarea";
import ODSelect from "@/components/form/ODSelect";
import { Edit, PlayCircle, FileText, Hash, Link } from "lucide-react";
import { TModule } from "@/types";

interface EditModuleModalProps {
  module: TModule;
  onSuccess: () => void;
}

export default function EditModuleModal({
  module,
  onSuccess,
}: EditModuleModalProps) {
  const { toast } = useToast();
  const { mutate: updateModule, isPending } = useUpdateModule();

  const statusOptions = [
    { value: "false", label: "In Progress" },
    { value: "true", label: "Completed" },
  ];

  const defaultValues = {
    name: module.name,
    description: module.description,
    module_number: module.module_number.toString(),
    video_url: module.video_url,
  };

  const onSubmit = (data: any) => {
    const moduleData = {
      name: data.name,
      description: data.description,
      module_number: parseInt(data.module_number),
      video_url: data.video_url,
    };

    updateModule(
      { id: module._id!, data: moduleData },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Module updated successfully!",
          });
          onSuccess();
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error.response?.data?.message ||
              error.message ||
              "Failed to update module",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <PlayCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Edit Module</h3>
            <p className="text-sm text-gray-500">
              Update module information and content
            </p>
          </div>
        </div>
      </div>

      {/* Current Module Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border">
        <h4 className="font-medium text-gray-900 mb-2">Current Module Info</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Module No:</span>
            <span className="ml-2 font-medium">{module.module_number}</span>
          </div>
          {/* <div>
            <span className="text-gray-500">Status:</span>
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                module.isCompleted
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {module.isCompleted ? "Completed" : "In Progress"}
            </span>
          </div> */}
        </div>
      </div>

      {/* Form */}
      <ODForm defaultValues={defaultValues} onSubmit={onSubmit}>
        <div className="space-y-6">
          {/* Module Number & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Hash className="w-4 h-4 text-blue-600" />
                </div>
                Module Number
              </label>
              <ODInput
                name="module_number"
                label=""
                type="number"
                placeholder="1"
                required
                className="h-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-all duration-200"
              />
            </div>

            {/* <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <Edit className="w-4 h-4 text-green-600" />
                </div>
                Status
              </label>
              <ODSelect
                name="isCompleted"
                label=""
                options={statusOptions}
                required
                className="h-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-all duration-200"
              />
            </div> */}
          </div>

          {/* Module Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              Module Name
            </label>
            <ODInput
              name="name"
              label=""
              placeholder="Enter module name"
              required
              className="h-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Module Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-orange-600" />
              </div>
              Module Description
            </label>
            <ODTextarea
              name="description"
              label=""
              placeholder="Describe what this module covers"
              required
              rows={4}
              className="bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Video URL */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <Link className="w-4 h-4 text-red-600" />
              </div>
              Video URL
            </label>
            <ODInput
              name="video_url"
              label=""
              placeholder="https://youtube.com/watch?v=..."
              required
              className="h-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-all duration-200"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a YouTube, Vimeo, or direct video URL
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 mt-8 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onSuccess}
              className="flex-1 h-11 rounded-xl border-gray-200 hover:bg-gray-50 font-medium transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Update Module
                </>
              )}
            </Button>
          </div>
        </div>
      </ODForm>
    </div>
  );
}
