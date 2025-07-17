"use client";
import { useForm } from "react-hook-form";
import { TCourse } from "@/types/course";
import { useAddCourse } from "@/hooks/courses.hook";
import { useInstructors } from "@/hooks/instructor.hooks";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddCourseForm() {
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<TCourse>();
    const { mutate: addCourse, isPending, isSuccess, error } = useAddCourse();
    const { data: instructors = [], isLoading: loadingInstructors } = useInstructors();

    const courseTypes = ["free", "paid"];
    const courseCategories = ["HSC", "Admission", "Skill Development", "Others"];

    const onSubmit = (data: TCourse) => {
        addCourse(data, {
            onSuccess: () => reset(),
        });
    };

    return (
        <Card className="max-w-xl mx-auto mt-10">
            <CardHeader>
                <CardTitle>Add New Course</CardTitle>
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
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Adding..." : "Add Course"}
                    </Button>
                    {isSuccess && <span className="text-green-500 text-xs">Course added successfully!</span>}
                    {error && <span className="text-red-500 text-xs">{error.message}</span>}
                </form>
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    );
}
