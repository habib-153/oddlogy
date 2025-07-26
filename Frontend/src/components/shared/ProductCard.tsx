"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Heart, Users, BookOpen } from "lucide-react";
import { ProductCardProps } from "@/types";

export function ProductCard({
  id,
  imageUrl,
  title,
  price,
  description,
  category,
  status,
  studentsEnrolled = 0,
  moduleCount = 0,
  className,
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-gray-200">
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-300">
                {title.charAt(0)}
              </span>
            </div>
          )}
        </AspectRatio>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <Link href={`/courses/${id}`} className="w-full">
            <Button
              variant="secondary"
              size="sm"
              className="w-full bg-white hover:bg-gray-100 text-gray-800"
            >
              View Course
            </Button>
          </Link>
        </div>

        <Badge
          className="absolute top-3 left-3"
          variant={price === "Free" ? "secondary" : "default"}
        >
          {price}
        </Badge>
      </div>

      <CardHeader className="p-4">
        <Link
          href={`/courses/${id}`}
          className="text-lg font-semibold line-clamp-1 hover:text-primary transition-colors"
        >
          {title}
        </Link>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </CardHeader>

      <CardContent className="px-4 pb-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {studentsEnrolled} enrolled
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            {moduleCount} modules
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 border-t flex justify-between">
        <Badge variant="outline">{category}</Badge>
        <Badge variant={status === "completed" ? "default" : "secondary"}>
          {status}
        </Badge>
      </CardFooter>
    </Card>
  );
}