import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Users } from "lucide-react";
import { TCourse } from "@/types/course";

export default function CourseCard({course} : { course: TCourse }) {
  return (
    <>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          {course.media?.thumbnail ? (
            <Image
              src={course.media.thumbnail}
              alt={course.title}
              fill
              className="object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-t-lg">
              <span className="text-3xl font-bold text-gray-300">
                {course.title.charAt(0)}
              </span>
            </div>
          )}
          <Badge
            className="absolute top-2 right-2"
            variant={course.courseType === "free" ? "secondary" : "default"}
          >
            {course.courseType === "free"
              ? "Free"
              : `৳${course.salePrice || course.price}`}
          </Badge>
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-1">{course.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {course.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            {course.studentEnrolled || 0} enrolled
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-between items-center w-full">
            <Badge variant="outline">{course.courseCategory}</Badge>
            <Badge
              variant={
                course.courseStatus === "completed" ? "default" : "secondary"
              }
            >
              {course.courseStatus}
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}