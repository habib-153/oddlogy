import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";


interface ClassLevel {
  id: string;
  icon: string;
  title: string;
  href: string;
  description?: string;
}

export default function ClassLevelsGrid() {
  const classLevels: ClassLevel[] = [
    {
      id: "1",
      icon: "/assets/img/icons/book.png",
      title: "Video Book",
      href: "/academic",
      description: "Interactive video lessons with comprehensive materials",
    },
    {
      id: "2",
      icon: "/assets/img/icons/10.png",
      title: "Class 10",
      href: "/academic",
      description: "Complete syllabus coverage for class 10 students",
    },
    {
      id: "3",
      icon: "/assets/img/icons/exam-3.png",
      title: "Class 9",
      href: "/academic",
      description: "Structured learning material for class 9 curriculum",
    },
    {
      id: "4",
      icon: "/assets/img/icons/8.png",
      title: "Class 8",
      href: "/academic",
      description: "Engaging content designed for class 8 students",
    },
    {
      id: "5",
      icon: "/assets/img/icons/7.png",
      title: "Class 7",
      href: "/academic",
      description: "Learning modules tailored for class 7 students",
    },
    {
      id: "6",
      icon: "/assets/img/icons/6.png",
      title: "Class 6",
      href: "/academic",
      description: "Foundation building courses for class 6 students",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span>6th-HSC class Online batch </span>
            <span className="relative inline-block">
              <span className="relative z-10">admission</span>
              <span className="absolute inset-x-0 bottom-0 h-3 bg-[#D2DD27] opacity-30 z-0"></span>
            </span>
            <br /> is going on!
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {classLevels.map((level) => (
            <HoverCard key={level.id}>
              <HoverCardTrigger asChild>
                <Link
                  href={level.href}
                  className="block transition-transform hover:-translate-y-1"
                >
                  <Card className="h-full border shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden group">
                    <CardContent className="flex flex-col items-center justify-center p-4 h-full">
                      <div className="relative w-16 h-16 mb-4 mt-4 transition-transform duration-300 group-hover:scale-110">
                        <Image
                          src={level.icon}
                          alt={level.title}
                          fill
                          sizes="64px"
                          className="object-contain"
                        />
                      </div>
                      <h3 className="font-bold text-center text-gray-800 group-hover:text-[#D2DD27] transition-colors">
                        {level.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{level.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {level.description ||
                        `Comprehensive learning path for ${level.title}`}
                    </p>
                    <div className="flex items-center pt-2">
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        Enrolling Now
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
}