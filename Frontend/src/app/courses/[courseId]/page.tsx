"use client";

import { use, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCourse } from "@/hooks/courses.hook";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Clock, GraduationCap } from "lucide-react";
import Image from "next/image";
import CourseList from "@/components/courses/CourseList";
import YouTubeEmbed from "@/components/shared/YouTubeEmbed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EnrollmentModal from "@/components/courses/EnrollmentModal";
import CourseDetailSkeleton from "@/components/courses/CourseDetailSkeleton";
import { useToast } from "@/hooks/use-toast";

interface CourseDetailPageProps {
  params: Promise<{ courseId: string }>;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { courseId } = use(params);
  const { data: course, isLoading } = useCourse(courseId);
  const { data: session, status } = useSession();
  const { user: authUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  const user = session?.user || authUser;

  // Function to extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/
    );
    return match ? match[1] : null;
  };

  const handleEnrollClick = () => {
    // Check if user is authenticated
    if (status === "loading") {
      toast({
        title: "Please wait",
        description: "Checking authentication...",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to enroll in this course",
        variant: "destructive",
      });
      // Redirect to login with return URL
      router.push(`/login?redirect=/courses/${courseId}`);
      return;
    }

    // Open enrollment modal if authenticated
    setShowEnrollmentModal(true);
  };

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  if (!course) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
          <p className="text-gray-500 max-w-md">
            The course you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Course Hero Section */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video rounded-xl overflow-hidden">
            {course.media?.intro_video ? (
              <YouTubeEmbed
                videoId={getYouTubeId(course.media.intro_video) || ""}
                title={course.title}
              />
            ) : (
              <Image
                src={
                  course.media?.banner ||
                  course.media?.thumbnail ||
                  "/placeholder.jpg"
                }
                alt={course.title}
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Course Content Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">
                  About This Course
                </h3>
                <p className="text-gray-700">{course.description}</p>

                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-3">
                      Prerequisites
                    </h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {course.prerequisites.map((prereq, index) => (
                        <li key={index} className="text-gray-700">
                          {prereq.course}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="curriculum" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">
                  Course Curriculum
                </h3>
                {course.modules && course.modules.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {course.modules.map((module: any, index: number) => (
                      <AccordionItem key={module._id} value={`module-${index}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {module.module_number}
                              </span>
                            </div>
                            <div className="text-left">
                              <p className="font-medium">{module.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {module.isCompleted
                                  ? "Completed"
                                  : "Not completed"}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-11 pt-2">
                            <p className="text-sm text-gray-600">
                              {module.description}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No curriculum available yet</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="instructor" className="mt-6">
              {course.instructor ? (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={course.instructor.avatar} />
                      <AvatarFallback>
                        {course.instructor.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {course.instructor.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {course.instructor.title || "Course Instructor"}
                      </p>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <p>{course.instructor.bio}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    Instructor information not available
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Course Info Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <div className="bg-card rounded-xl border p-6 space-y-6">
              <div className="space-y-2">
                <div className="text-3xl font-bold">
                  {course.courseType === "free" ? (
                    "Free"
                  ) : (
                    <>
                      ৳{course.salePrice || course.price || 0}
                      {course.salePrice && course.price && (
                        <span className="text-lg text-muted-foreground line-through ml-2">
                          ৳{course.price}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {course.studentEnrolled || 0} students
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {course.moduleCount || 0} modules
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Self paced</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Certificate</span>
                </div>
              </div>

              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className="w-full justify-center py-1.5"
                >
                  {course.courseCategory}
                </Badge>
                <Badge
                  variant={
                    course.courseType === "free" ? "secondary" : "default"
                  }
                  className="w-full justify-center py-1.5"
                >
                  {course.courseType === "free"
                    ? "Free Course"
                    : "Premium Course"}
                </Badge>
              </div>

              <Button
                onClick={handleEnrollClick}
                size="lg"
                className="w-full"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Loading..." : "Enroll Now"}
              </Button>

              {!user && (
                <p className="text-xs text-center text-muted-foreground">
                  Please login to enroll in this course
                </p>
              )}

              {/* <div className="text-sm text-center text-muted-foreground">
                💯 Quality Guaranteed
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Related Courses */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Courses</h2>
        <CourseList
          category={course.courseCategory}
          limit={4}
          showHeader={false}
        />
      </div>

      {/* Only show modal if user is authenticated */}
      {user && (
        <EnrollmentModal
          isOpen={showEnrollmentModal}
          onClose={() => setShowEnrollmentModal(false)}
          course={course}
          user={user}
        />
      )}
    </div>
  );
}