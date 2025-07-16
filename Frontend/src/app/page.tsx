import HeroCarousel from "@/components/sections/HeroCarousel";
import ProductGrid from "@/components/sections/ProductGrid";
import FeatureSection from "@/components/sections/FeatureSection";
import CallToAction from "@/components/sections/CallToAction";
import CounterStats from "@/components/sections/CounterStats";
import Footer from "@/components/shared/footer";
import ClassLevelsGrid from "@/components/sections/ClassLevel";
import TestimonialCarousel from "@/components/sections/Testimonials";
import { hscCourses, skillDevelopmentCourses } from "@/constants";

const HomePage = () => {

  // Feature section data
  const features = [
    {
      id: "1",
      icon: "/assets/img/icons/academic.png",
      title: "Academic",
      description:
        "Access structured academic courses to deepen subject knowledge and advance in formal education pathways.",
    },
    {
      id: "2",
      icon: "/assets/img/icons/check-list.png",
      title: "Admission",
      description:
        "Advance your professional career with courses focused on leadership, management, and career-building strategies.",
    },
    {
      id: "3",
      icon: "/assets/img/icons/skill.png",
      title: "Skills",
      description:
        "Enhance practical expertise with hands-on courses designed to build job-ready skills across diverse industries.",
    },
  ];

  // Counter stats data
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

  return (
    <>
      <main>
        <HeroCarousel />

        <ClassLevelsGrid />

        <FeatureSection title="Choose Your Desired Path" features={features} />

        <ProductGrid
          title="Skill Development All Courses"
          products={skillDevelopmentCourses}
        />

        {/* <TestimonialCarousel /> */}
        <ProductGrid
          title="Free Courses For HSC & Admission Candidate"
          products={hscCourses}
        />


        <CallToAction
          title="Need the best teacher-made class notes and lecture sheets?"
          buttonText="Download For Free"
          buttonLink="#"
          imageUrl="/assets/img/others/sheets.png"
        />

        <CounterStats
          title="Our Success For 2022-24 Academic Year"
          counters={counterStats}
        />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;