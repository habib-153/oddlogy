import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import logo from "@/../public/assets/img/logo-white.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="inline-block mb-6">
              <Image src={logo} alt="Oddology Logo" width={200} height={60} />
            </Link>
            <p className="text-gray-400 mb-4">
              Join Oddology for expert-led online courses. Unlock new skills and
              advance your career with flexible, engaging learning experiences.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="h-10 w-10 rounded-full bg-[#D2DD27] flex items-center justify-center text-gray-800 transition-transform hover:scale-110"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="#"
                className="h-10 w-10 rounded-full bg-[#D2DD27] flex items-center justify-center text-gray-800 transition-transform hover:scale-110"
              >
                <Twitter size={18} />
              </Link>
              <Link
                href="#"
                className="h-10 w-10 rounded-full bg-[#D2DD27] flex items-center justify-center text-gray-800 transition-transform hover:scale-110"
              >
                <Instagram size={18} />
              </Link>
              <Link
                href="#"
                className="h-10 w-10 rounded-full bg-[#D2DD27] flex items-center justify-center text-gray-800 transition-transform hover:scale-110"
              >
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 relative">
              Quick Links
              <span className="absolute left-0 bottom-0 h-0.5 w-12 bg-[#D2DD27]"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-[#D2DD27] flex items-center"
                >
                  <ArrowRight size={14} className="mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-[#D2DD27] flex items-center"
                >
                  <ArrowRight size={14} className="mr-2" />
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-[#D2DD27] flex items-center"
                >
                  <ArrowRight size={14} className="mr-2" />
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-[#D2DD27] flex items-center"
                >
                  <ArrowRight size={14} className="mr-2" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 relative">
              Support
              <span className="absolute left-0 bottom-0 h-0.5 w-12 bg-[#D2DD27]"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-[#D2DD27] flex items-center"
                >
                  <ArrowRight size={14} className="mr-2" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-[#D2DD27] flex items-center"
                >
                  <ArrowRight size={14} className="mr-2" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-[#D2DD27] flex items-center"
                >
                  <ArrowRight size={14} className="mr-2" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-[#D2DD27] flex items-center"
                >
                  <ArrowRight size={14} className="mr-2" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 relative">
              Newsletter
              <span className="absolute left-0 bottom-0 h-0.5 w-12 bg-[#D2DD27]"></span>
            </h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Your email"
                className="rounded-r-none border-gray-700 bg-gray-700 text-white focus-visible:ring-[#D2DD27]"
              />
              <Button
                type="submit"
                className="rounded-l-none bg-[#D2DD27] text-gray-800 hover:text-white"
              >
                Subscribe
              </Button>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-3">Contact</h3>
              <p className="flex items-start text-gray-400 mb-1">
                <i className="fas fa-phone mr-3 text-[#D2DD27] mt-1"></i>
                <Link
                  href="mailto:oddlogyedtech@gmail.com"
                  className="hover:text-[#D2DD27]"
                >
                  oddlogyedtech@gmail.com
                </Link>
              </p>
              <p className="flex items-start text-gray-400 mb-1">
                <i className="fas fa-phone mr-3 text-[#D2DD27] mt-1"></i>
                <Link href="tel:01818221949" className="hover:text-[#D2DD27]">
                  01818221949
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400">
            © 2019-{currentYear} All rights reserved by ODDLOGY
          </p>
        </div>
      </div>
    </footer>
  );
}