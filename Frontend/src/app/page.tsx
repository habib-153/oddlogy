import HeroCarousel from "@/components/sections/HeroCarousel";
import CourseGrid from "@/components/sections/CourseGrid";
import FeatureSection from "@/components/sections/FeatureSection";
import CallToAction from "@/components/sections/CallToAction";
import CounterStats from "@/components/sections/CounterStats";
import Footer from "@/components/shared/footer";
import ClassLevelsGrid from "@/components/sections/ClassLevel";

const HomePage = () => {
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

  return (
    <>
      <main>
        <HeroCarousel />
        <ClassLevelsGrid />
        <FeatureSection title="Choose Your Desired Path" features={features} />

        {/* Replace ProductGrid with CourseGrid */}
        <CourseGrid
          title="Skill Development All Courses"
          category="Skill Development"
          limit={4}
        />

        <CourseGrid
          title="Courses For Admission Candidate"
          category="Admission"
          limit={4}
        />

        <CallToAction
          title="Need the best teacher-made class notes and lecture sheets?"
          buttonText="Download For Free"
          buttonLink="#"
          imageUrl="/assets/img/others/sheets.png"
        />

        <CounterStats />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;