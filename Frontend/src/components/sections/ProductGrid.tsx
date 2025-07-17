import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "../shared/ProductCard";

interface ProductGridProps {
  title: string;
  products: {
    id: string;
    imageUrl: string;
    title: string;
    price: string;
    rating: number;
  }[];
  viewAllLink?: string;
}

export default function ProductGrid({
  title,
  products,
  viewAllLink = "/courses",
}: ProductGridProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
            {title}
            <span className="absolute left-0 -bottom-4 w-1/3 h-1 bg-[#D2DD27] transform -translate-y-2"></span>
          </h2>

          <Link
            href={viewAllLink}
            className={buttonVariants({
              variant: "ghost",
              className: "mt-4 md:mt-0",
            })}
          >
            View all courses <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              imageUrl={product.imageUrl}
              title={product.title}
              price={product.price}
              rating={product.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
}