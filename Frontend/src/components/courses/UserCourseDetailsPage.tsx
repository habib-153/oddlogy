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
} from "lucide-react";
import Image from "next/image";
import { TUserCourse } from "@/types/course";

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
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getEmbedUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&origin=`;
    }
    return url;
  };

  if (!videoUrl) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Video not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video relative bg-black rounded-lg overflow-hidden">
      {!isPlaying ? (
        <div
          className="relative w-full h-full cursor-pointer"
          onClick={() => setIsPlaying(true)}
        >
          <iframe
            src={getEmbedUrl(videoUrl).replace("autoplay=1", "autoplay=0")}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-gray-800 ml-1" />
            </div>
          </div>
        </div>
      ) : (
        <iframe
          src={getEmbedUrl(videoUrl)}
          title={title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
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

  const sortedModules =
    course.modules?.sort((a, b) => a.module_number - b.module_number) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Courses
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-brand-secondary">
            {course.title}
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - Video Player */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5" />
                {selectedModule
                  ? `Module ${selectedModule.module_number}: ${selectedModule.name}`
                  : "Select a Module"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedModule ? (
                <div className="space-y-4">
                  <VideoPlayer
                    videoUrl={selectedModule.video_url}
                    title={selectedModule.name}
                  />
                  {selectedModule.description && (
                    <div>
                      <h4 className="font-semibold mb-2">Module Description</h4>
                      <p className="text-muted-foreground">
                        {selectedModule.description}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PlayCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">
                      Select a module to start watching
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Module List */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Course Modules ({course.moduleCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sortedModules.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No modules available
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Modules will appear here once they are added to the course.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedModules.map((module, index) => (
                    <div
                      key={module._id}
                      onClick={() => setSelectedModule(module)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedModule?._id === module._id
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-gray-50 border-gray-200"
                      }`}
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
                          <h4 className="text-sm font-medium line-clamp-2">
                            {module.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={
                                module.video_url ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              {module.video_url
                                ? "Video Available"
                                : "No Video"}
                            </Badge>
                            {module.isCompleted && (
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
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Course Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Modules</span>
                  <span className="font-semibold">{course.moduleCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completed</span>
                  <span className="font-semibold text-green-600">
                    {course.completedModules}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Remaining</span>
                  <span className="font-semibold text-orange-600">
                    {course.moduleCount - course.completedModules}
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="font-bold text-primary">
                      {Math.round(course.progressPercentage)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}