"use client";
import { useForm } from "react-hook-form";
import { TCourse } from "@/types/course";
import { useUpdateCourse, useCourse } from "@/hooks/courses.hook";
import { useInstructors } from "@/hooks/instructor.hooks";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UpdateCourseForm({ courseId }: { courseId: string }) {
    const { data: course, isLoading } = useCourse(courseId);
    const { register, handleSubmit, formState: { errors }, reset, } = useForm<TCourse>({ defaultValues: course ?? undefined });
    const { data: instructors = [], isLoading: loadingInstructors } = useInstructors();
    const courseTypes = ["free", "paid", "subscription"];
    const courseCategories = ["HSC", "Admission", "Skill Development", "Others"];
    const { mutate: updateCourse, isPending, isSuccess, error } = useUpdateCourse(courseId);

    const onSubmit = (data: TCourse) => {
        updateCourse(data, {
            onSuccess: () => reset(course ?? undefined),
        });
    };

    if (isLoading) return <div className="p-8 text-center">Loading course...</div>;
    if (!course) return <div className="p-8 text-center text-red-500">Course not found</div>;

    return (
        <Card className="max-w-xl mx-auto mt-10">
            <CardHeader>
                <CardTitle>Update Course</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...register("title", { required: true })} />
                        {errors.title && <span className="text-red-500 text-xs">Title is required</span>}
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" {...register("description", { required: true })} />
                        {errors.description && <span className="text-red-500 text-xs">Description is required</span>}
                    </div>
                    <div>
                        <Label htmlFor="courseCategory">Category</Label>
                        <select id="courseCategory" {...register("courseCategory", { required: true })} className="w-full border rounded px-2 py-2">
                            <option value="">Select category</option>
                            {courseCategories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.courseCategory && <span className="text-red-500 text-xs">Category is required</span>}
                    </div>
                    <div>
                        <Label htmlFor="courseType">Type</Label>
                        <select id="courseType" {...register("courseType", { required: true })} className="w-full border rounded px-2 py-2">
                            <option value="">Select type</option>
                            {courseTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.courseType && <span className="text-red-500 text-xs">Type is required</span>}
                    </div>
                    <div>
                        <Label htmlFor="instructor">Instructor</Label>
                        <select id="instructor" {...register("instructor", { required: true })} className="w-full border rounded px-2 py-2">
                            <option value="">Select instructor</option>
                            {loadingInstructors ? (
                                <option>Loading...</option>
                            ) : (
                                instructors.map((inst) => (
                                    <option key={inst._id} value={inst._id}>{inst.name}</option>
                                ))
                            )}
                        </select>
                        {errors.instructor && <span className="text-red-500 text-xs">Instructor is required</span>}
                    </div>
                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input id="price" type="number" {...register("price")} />
                    </div>
                    <div>
                        <Label htmlFor="salePrice">Sale Price</Label>
                        <Input id="salePrice" type="number" {...register("salePrice")} />
                    </div>
                    <div>
                        <Label htmlFor="studentEnrolled">Student Enrolled</Label>
                        <Input id="studentEnrolled" type="number" {...register("studentEnrolled")} />
                    </div>
                    <div>
                        <Label htmlFor="moduleCount">Module Count</Label>
                        <Input id="moduleCount" type="number" {...register("moduleCount")} />
                    </div>
                    <div>
                        <Label htmlFor="courseStatus">Status</Label>
                        <Input id="courseStatus" {...register("courseStatus")} />
                    </div>
                    <div>
                        <Label htmlFor="media.banner">Banner URL</Label>
                        <Input id="media.banner" {...register("media.banner")} />
                    </div>
                    <div>
                        <Label htmlFor="media.intro_video">Intro Video URL</Label>
                        <Input id="media.intro_video" {...register("media.intro_video")} />
                    </div>
                    <div>
                        <Label htmlFor="media.thumbnail">Thumbnail URL</Label>
                        <Input id="media.thumbnail" {...register("media.thumbnail")} />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Course"}
                    </Button>
                    {isSuccess && <span className="text-green-500 text-xs">Course updated successfully!</span>}
                    {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </form>
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    );
}
