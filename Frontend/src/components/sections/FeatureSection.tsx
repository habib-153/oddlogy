import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  link?: string;
}

interface FeatureSectionProps {
  title: string;
  features: FeatureItem[];
}

export default function FeatureSection({
  title,
  features,
}: FeatureSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 relative">
          <span className="relative inline-block">
            {title}
            <span className="absolute left-0 -bottom-4 w-full h-1 bg-[#D2DD27] transform -translate-y-2"></span>
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className="overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg border-none"
            >
              <CardHeader className="text-center pt-8">
                <div className="flex justify-center mb-6">
                  <div className="relative w-20 h-20">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-center pb-6">
                <Link
                  href={feature.link || "#"}
                  className={buttonVariants({
                    variant: "ghost",
                    className: "hover:bg-[#D2DD27]/20",
                  })}
                >
                  Learn More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}