"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Clock,
  BookOpen,
  User,
  Calendar,
  Video,
  PlayCircle,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import { TUserCourse } from "@/types/course";
import { cn } from "@/lib/utils";

interface UserCourseDetailsPageProps {
  course: TUserCourse;
  onBack: () => void;
}

const VideoPlayer = ({
  videoUrl,
  title,
}: {
  videoUrl: string;
  title: string;
}) => {
  if (!videoUrl) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Video className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm sm:text-base">
            Video not available
          </p>
        </div>
      </div>
    );
  }

  // Check if videoUrl is an iframe
  const isIframe = videoUrl.trim().toLowerCase().startsWith("<iframe");

  if (isIframe) {
    // Extract src from iframe for preview/validation
    const srcMatch = videoUrl.match(/src="([^"]+)"/);
    const hasValidSrc = srcMatch && srcMatch[1];

    if (!hasValidSrc) {
      return (
        <div className="aspect-video bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Video className="w-8 h-8 sm:w-12 sm:h-12 text-red-400 mx-auto mb-2" />
            <p className="text-red-600 text-sm sm:text-base">
              Invalid iframe code
            </p>
          </div>
        </div>
      );
    }

    // Render the iframe directly with responsive styling
    return (
      <div className="aspect-video relative bg-black rounded-lg overflow-hidden">
        <div
          dangerouslySetInnerHTML={{ __html: videoUrl }}
          className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 [&>iframe]:rounded-lg"
        />
      </div>
    );
  }

  // Fallback: if it's a regular URL, try to extract video ID for YouTube
  const getYouTubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  if (videoId) {
    return (
      <div className="aspect-video relative bg-black rounded-lg overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&fs=1`}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // If it's neither iframe nor YouTube URL, show external link
  return (
    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center space-y-4">
        <Video className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto" />
        <div>
          <p className="text-gray-600 mb-2 text-sm sm:text-base">
            External Video Link
          </p>
          <Button
            onClick={() => window.open(videoUrl, "_blank")}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open Video
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function UserCourseDetailsPage({
  course,
  onBack,
}: UserCourseDetailsPageProps) {
  const [selectedModule, setSelectedModule] = useState<any>(
    course.modules?.[0] || null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sortedModules =
    course.modules?.sort((a, b) => a.module_number - b.module_number) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto  py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to My Courses</span>
              <span className="sm:hidden">Back</span>
            </Button>

            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                {course.title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Continue your learning journey
              </p>
            </div>

            {/* Mobile Module List Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex items-center gap-2"
            >
              <Menu className="w-4 h-4" />
              Modules
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-4">
          {/* Main Content - Video Player */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Video Player Card */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <PlayCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="line-clamp-2">
                    {selectedModule
                      ? `Module ${selectedModule.module_number}: ${selectedModule.name}`
                      : "Select a Module"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {selectedModule ? (
                  <div className="space-y-4">
                    <VideoPlayer
                      videoUrl={selectedModule.video_url}
                      title={selectedModule.name}
                    />

                    {/* Module Info - Mobile Responsive */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <PlayCircle className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-blue-900 mb-1 text-sm sm:text-base">
                            {selectedModule.name}
                          </h4>
                          <p className="text-blue-700 text-xs sm:text-sm">
                            Module {selectedModule.module_number} •
                            {selectedModule.isCompleted
                              ? " Completed"
                              : " In Progress"}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge
                            variant={
                              selectedModule.video_url ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {selectedModule.video_url
                              ? "Video Available"
                              : "No Video"}
                          </Badge>
                          {selectedModule.isCompleted && (
                            <Badge
                              variant="outline"
                              className="text-xs text-green-600"
                            >
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {selectedModule.description && (
                      <div className="bg-white border rounded-lg p-3 sm:p-4">
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">
                          Module Description
                        </h4>
                        <p className="text-muted-foreground text-sm sm:text-base">
                          {selectedModule.description}
                        </p>
                      </div>
                    )}

                    {/* Module Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                      <Button
                        size="sm"
                        onClick={() => {
                          // Mark as completed logic here
                          console.log("Mark module as completed");
                        }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {selectedModule.isCompleted
                          ? "Completed"
                          : "Mark Complete"}
                      </Button>

                      {selectedModule.video_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Extract URL for external opening
                            const isIframe = selectedModule.video_url
                              .trim()
                              .toLowerCase()
                              .startsWith("<iframe");
                            if (isIframe) {
                              const srcMatch =
                                selectedModule.video_url.match(/src="([^"]+)"/);
                              if (srcMatch && srcMatch[1]) {
                                window.open(srcMatch[1], "_blank");
                              }
                            } else {
                              window.open(selectedModule.video_url, "_blank");
                            }
                          }}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open in New Tab
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <PlayCircle className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm sm:text-base">
                        Select a module to start watching
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Module List */}
          <div
            className={cn(
              "space-y-4 sm:space-y-6",
              "lg:block", // Always visible on large screens
              sidebarOpen ? "block" : "hidden" // Toggle on mobile
            )}
          >
            {/* Mobile Overlay */}
            {sidebarOpen && (
              <div
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Module List Card */}
            <Card
              className={cn(
                "border-0 shadow-sm",
                "lg:relative lg:z-auto", // Normal positioning on large screens
                sidebarOpen &&
                  "lg:hidden fixed top-4 right-4 bottom-4 w-80 max-w-[90vw] z-50 overflow-hidden" // Fixed positioning on mobile when open
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <BookOpen className="w-5 h-5 flex-shrink-0" />
                  <span>Modules ({course.moduleCount})</span>
                </CardTitle>
                {sidebarOpen && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="pt-0 overflow-y-auto max-h-[calc(100vh-8rem)] lg:max-h-none">
                {sortedModules.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      No modules available
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Modules will appear here once they are added to the
                      course.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sortedModules.map((module, index) => (
                      <div
                        key={module._id}
                        onClick={() => {
                          setSelectedModule(module);
                          setSidebarOpen(false); // Close sidebar on mobile after selection
                        }}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-colors",
                          selectedModule?._id === module._id
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-gray-50 border-gray-200"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            {module.isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <span className="text-xs font-medium text-blue-600">
                                {module.module_number}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium line-clamp-2 mb-1">
                              {module.name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-1">
                              <Badge
                                variant={
                                  module.video_url ? "default" : "secondary"
                                }
                                className="text-xs"
                              >
                                {module.video_url ? "Video" : "No Video"}
                              </Badge>
                              {module.isCompleted && (
                                <Badge
                                  variant="outline"
                                  className="text-xs text-green-600"
                                >
                                  ✓
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress Card */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">
                      {Math.round(course.progressPercentage)}%
                    </span>
                  </div>
                  <Progress value={course.progressPercentage} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">
                        {course.completedModules}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Completed
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">
                        {course.moduleCount - course.completedModules}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Remaining
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}