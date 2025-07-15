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

const carouselItems = [
  {
    id: 1,
    imageUrl:
      "https://res.cloudinary.com/drrhtmzpk/image/upload/v1728529588/f85xjq0byfl-1728529586860-image-backgroundBanner.jpg",
  },
  {
    id: 2,
    imageUrl:
      "https://res.cloudinary.com/drrhtmzpk/image/upload/v1728038313/xie8u7b0efr-1728038311322-image-about2.jpg",
  },
  {
    id: 3,
    imageUrl:
      "https://res.cloudinary.com/drrhtmzpk/image/upload/v1728653289/ctv9vwavp85-1728653289337-profilePhoto-Screenshot%202024-07-31%20004735.png",
  },
];

export default function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

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
          {carouselItems.map((item) => (
            <CarouselItem key={item.id}>
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={item.imageUrl}
                  alt={`Slide ${item.id}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 100vw"
                  quality={90}
                  priority={item.id === 1}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-black/50 text-white hover:bg-black/70" />
        <CarouselNext className="right-4 bg-black/50 text-white hover:bg-black/70" />
      </Carousel>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              "w-3 h-3 rounded-full transition-colors",
              i === current ? "bg-white" : "bg-white/50"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}