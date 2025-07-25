"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  useCarouselImages,
  useDeleteCarouselImage,
} from "@/hooks/carousel.hook";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Eye, Search } from "lucide-react";
import { TCarouselImage } from "@/types";
import AddCarouselModal from "@/components/Carousel/AddCarouselModal";

export default function CarouselManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<TCarouselImage | null>(
    null
  );

  const { toast } = useToast();
  const { data: images = [], isLoading, error } = useCarouselImages();
  const { mutate: deleteImage, isPending: isDeleting } =
    useDeleteCarouselImage();

  // Filter images based on search term
  const filteredImages = images.filter((image: TCarouselImage) =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (imageId: string) => {
    if (confirm("Are you sure you want to delete this carousel image?")) {
      deleteImage(imageId, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Carousel image deleted successfully!",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error.response?.data?.message ||
              error.message ||
              "Failed to delete carousel image",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handlePreview = (image: TCarouselImage) => {
    setSelectedImage(image);
    setShowPreviewModal(true);
  };

  if (error) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Error loading carousel images
            </h3>
            <p className="text-gray-500 mt-2">
              {error.message || "Something went wrong"}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Carousel Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage carousel images for your platform
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-brand-secondary hover:bg-brand-secondary/80 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Image
          </Button>
        </div>

        {/* Search and Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-colors"
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-medium">
                Total Images:{" "}
                <span className="text-brand-secondary">{images.length}</span>
              </span>
              {searchTerm && (
                <span className="font-medium">
                  Filtered:{" "}
                  <span className="text-black">
                    {filteredImages.length}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "No images found" : "No carousel images"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Start by adding your first carousel image"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-primary-dark hover:to-brand-accent text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Image
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <div
                  key={image._id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  {/* Image */}
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img
                      src={image.img_url}
                      alt={image.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate mb-3">
                      {image.name}
                    </h3>

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(image)}
                        className="flex-1 mr-2"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(image._id!)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Image Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center">Add Carousel Image</DialogTitle>
          </DialogHeader>
          <AddCarouselModal onSuccess={() => setShowAddModal(false)} />
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.name}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={selectedImage.img_url}
                alt={selectedImage.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}