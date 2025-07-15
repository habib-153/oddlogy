import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Download } from "lucide-react";

interface CallToActionProps {
  title: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
}

export default function CallToAction({
  title,
  buttonText,
  buttonLink,
  imageUrl,
}: CallToActionProps) {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <Card className="border-none shadow-lg bg-white overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-7/12 p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  {title}
                </h2>
                <Button
                  asChild
                  size="lg"
                  className="bg-[#D2DD27] text-gray-800 hover:text-white hover:bg-[#C1CC16]"
                >
                  <Link href={buttonLink} className="flex items-center">
                    {buttonText}
                    <Download className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="md:w-5/12 bg-gray-50 h-full p-8 flex items-center justify-center">
                <div className="relative w-full aspect-square max-w-sm transform transition-transform hover:scale-105 duration-300">
                  <Image
                    src={imageUrl}
                    alt="CTA Image"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}