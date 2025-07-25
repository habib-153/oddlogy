"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCreateCarouselImage } from "@/hooks/carousel.hook";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface AddCarouselModalProps {
  onSuccess: () => void;
}

export default function AddCarouselModal({ onSuccess }: AddCarouselModalProps) {
  const { toast } = useToast();
  const { mutate: createImage, isPending } = useCreateCarouselImage();
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("image", file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setValue("image", null);
  };

  const onSubmit = (data: any) => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image",
        variant: "destructive",
      });
      return;
    }

    createImage(
      {
        name: data.name,
        image: selectedFile,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Carousel image added successfully!",
          });
          reset();
          setPreview(null);
          setSelectedFile(null);
          onSuccess();
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error.response?.data?.message ||
              error.message ||
              "Failed to add carousel image",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Image Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Image name is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-colors"
            placeholder="Enter image name"
          />
          {errors.name && (
            <p className="text-sm text-red-500">
              {errors.name.message as string}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            {/* <Image className="w-4 h-4" /> */}
            Carousel Image
          </label>

          {!selectedFile ? (
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                title="Upload carousel image"
              />
              <div className="border-2 border-dashed border-gray-300 hover:border-brand-primary/50 hover:bg-brand-primary/5 rounded-xl p-8 text-center transition-all duration-200 cursor-pointer group">
                <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400 group-hover:text-brand-primary transition-colors" />
                <p className="text-sm font-medium mb-1 text-gray-700">
                  Click to upload carousel image
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, JPEG up to 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className="relative bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-xl p-4 border border-brand-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {preview && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border">
                      <Image
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        width={64}
                        height={64}
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                    </p>
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
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
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
            className="px-6 bg-brand-secondary  text-white"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Adding...
              </>
            ) : (
              "Add Image"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}