"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useCarouselImages } from "@/hooks/carousel.hook";

// const carouselItems = [
//   {
//     id: 1,
//     imageUrl:
//       "https://res.cloudinary.com/drrhtmzpk/image/upload/v1728529588/f85xjq0byfl-1728529586860-image-backgroundBanner.jpg",
//   },
//   {
//     id: 2,
//     imageUrl:
//       "https://res.cloudinary.com/drrhtmzpk/image/upload/v1728038313/xie8u7b0efr-1728038311322-image-about2.jpg",
//   },
//   {
//     id: 3,
//     imageUrl:
//       "https://res.cloudinary.com/drrhtmzpk/image/upload/v1728653289/ctv9vwavp85-1728653289337-profilePhoto-Screenshot%202024-07-31%20004735.png",
//   },
// ];

export default function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const { data: carouselItems, isLoading } = useCarouselImages();

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (api) {
        api.scrollNext();
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [api]);

  if (isLoading) {
    return (
      <section className="relative">
        <div className="h-[90vh] bg-gray-200 animate-pulse"></div>
      </section>
    );
  }

  return (
    <section className="relative">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {carouselItems?.map((item, index) => (
            <CarouselItem key={item?._id}>
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={item.img_url}
                  alt={`Slide ${item._id}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 100vw"
                  quality={90}
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-black/50 text-white hover:bg-black/70" />
        <CarouselNext className="right-4 bg-black/50 text-white hover:bg-black/70" />
      </Carousel>
    </section>
  );
}