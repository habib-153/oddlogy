"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CounterItem {
  id: string;
  icon: string;
  value: number;
  title: string;
  color?: string;
}

interface CounterStatsProps {
  title: string;
  counters: CounterItem[];
}

const counterStats = [
  {
    id: "1",
    icon: "fas fa-star",
    value: 4872,
    title: "Students Enrolled",
  },
  {
    id: "2",
    icon: "fas fa-chalkboard-teacher",
    value: 523,
    title: "Expert Instructors",
  },
  {
    id: "3",
    icon: "fas fa-user-plus",
    value: 810,
    title: "Admitted Today",
  },
  {
    id: "4",
    icon: "fas fa-certificate",
    value: 6000,
    title: "Certifications Issued",
  },
];


export default function CounterStats() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Our Achievements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {counterStats.map((counter) => (
            <Card
              key={counter.id}
              className="border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <CardContent className="text-center p-6">
                <i
                  className={`${counter.icon} text-4xl ${
                     "text-[#D2DD27]"
                  } mb-4`}
                ></i>
                <div className="text-4xl font-bold mb-2">
                  {hasAnimated ? (
                    <Counter end={counter.value} duration={2000} />
                  ) : (
                    "0"
                  )}
                </div>
                <div className="text-gray-600 uppercase tracking-wider text-sm font-medium mb-4">
                  {counter.title}
                </div>
                <Progress
                  value={hasAnimated ? 100 : 0}
                  className={`h-1.5 ${ "bg-[#D2DD27]/20"}`}
                  style={{
                    transition: "all 2s ease-out",
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CounterProps {
  end: number;
  duration: number;
}

function Counter({ end, duration }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const startAnimation = (timestamp: number) => {
      startTime = timestamp;
      animate(timestamp);
    };

    const animate = (timestamp: number) => {
      const runtime = timestamp - startTime;
      const relativeProgress = runtime / duration;

      if (relativeProgress < 1) {
        setCount(Math.floor(end * relativeProgress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
        cancelAnimationFrame(animationFrame);
      }
    };

    animationFrame = requestAnimationFrame(startAnimation);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count.toLocaleString()}</>;
}