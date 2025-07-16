"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Heart, ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  imageUrl: string;
  title: string;
  price: string;
  rating: number;
  discount?: number;
  className?: string;
}

export function ProductCard({
  imageUrl,
  title,
  price,
  rating,
  discount,
  className,
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-gray-200">
      <div className="relative">
        <AspectRatio ratio={1 / 1}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </AspectRatio>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <Button
            variant="secondary"
            size="sm"
            className="w-full bg-white hover:bg-gray-100 text-gray-800"
          >
            Quick View
          </Button>
        </div>

        <button title="add"
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center backdrop-blur-sm hover:bg-white transition-colors"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart
            className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
          />
        </button>

        {discount && (
          <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
            {discount}% OFF
          </Badge>
        )}
      </div>

      <CardContent className="pt-4">
        <div className="flex mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < rating ? "text-[#e52d53] fill-[#e52d53]" : "text-gray-300"
                }`}
            />
          ))}
        </div>

        <h3 className="font-bold text-lg truncate">
          <Link
            href={`/courses/${typeof window !== "undefined" ? window.location.pathname.split("/")[2] : ""}`}
            className="text-gray-900 hover:text-[#e52d53] transition-colors"
          >
            {title}
          </Link>
        </h3>

        <div className="text-[#e52d53] font-bold mt-1">{price}</div>
      </CardContent>

      <CardFooter className="pt-0 justify-end">
        <Button
          size="sm"
          className="bg-gray-800 hover:bg-[#e52d53] text-white rounded-xl h-9 w-9 p-0"
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}