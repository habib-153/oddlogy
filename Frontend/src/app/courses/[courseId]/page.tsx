import { getCourseById } from "@/utils/courses";
import { TCourse } from "@/types/course";
import Image from "next/image";
import { notFound } from "next/navigation";

interface CourseDetailPageProps {
    params: { courseId: string };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
    const course: TCourse | null = await getCourseById(params.courseId);
    if (!course) return notFound();

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                    <Image
                        src={course.media?.banner}
                        alt={course.title}
                        width={600}
                        height={340}
                        className="rounded-lg object-cover w-full h-64"
                    />
                </div>
                <div className="md:w-1/2">
                    <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                    <p className="mb-4 text-gray-700">{course.description}</p>
                    <div className="mb-2">
                        <span className="font-semibold">Category:</span> {course.courseCategory}
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold">Type:</span> {course.courseType}
                    </div>
                    {course.price && (
                        <div className="mb-2">
                            <span className="font-semibold">Price:</span> ${course.price}
                        </div>
                    )}
                    {course.salePrice && (
                        <div className="mb-2">
                            <span className="font-semibold">Sale Price:</span> ${course.salePrice}
                        </div>
                    )}
                    <div className="mb-2">
                        <span className="font-semibold">Enrolled:</span> {course.studentEnrolled}
                    </div>
                </div>
            </div>
        </div>
    );
}
