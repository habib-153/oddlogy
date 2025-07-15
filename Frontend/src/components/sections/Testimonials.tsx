"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Testimonial {
  id: string;
  image: string;
  comment: string;
  name: string;
  position?: number;
}

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: "1",
      image:
        "https://images.moksy.com/templates/default/people/people-four.png",
      comment:
        "Our digital learning platform offers flexible, interactive courses that fit your schedule. Access top-quality education anytime, anywhere, and take control of your learning journey with ease.",
      name: "Lauren Cox",
      position: 1,
    },
    {
      id: "2",
      image:
        "https://images.moksy.com/templates/default/people/people-five.png",
      comment:
        "This course exceeded my expectations! The content was clear and engaging, making complex topics easy to understand. Highly recommend it to anyone looking to expand their knowledge.",
      name: "Terry Fletcher",
      position: 2,
    },
    {
      id: "3",
      image: "https://images.moksy.com/templates/default/people/people-six.png",
      comment:
        "A well-structured course with practical insights. The instructor was knowledgeable and provided valuable real-world examples. Perfect for beginners and those wanting a refresher.",
      name: "John Doe",
      position: 3,
    },
    {
      id: "4",
      image:
        "https://images.moksy.com/templates/default/people/people-seven.png",
      comment:
        "Thoroughly enjoyed this course. It was informative, concise, and easy to follow. The interactive elements kept me engaged throughout. Definitely worth the time and investment!",
      name: "Jessie Barnett",
      position: 4,
    },
    {
      id: "5",
      image: "https://images.moksy.com/templates/default/teams/team-two.jpg",
      comment:
        "Unlock endless knowledge with our intuitive app—engage in interactive lessons, track progress seamlessly, and master new skills anytime, anywhere.",
      name: "Taylor Swift",
      position: 5,
    },
    {
      id: "6",
      image: "https://images.moksy.com/templates/default/teams/team-seven.jpg",
      comment:
        "Our latest course on AI in Education explores innovative ways artificial intelligence is transforming the learning experience.",
      name: "James Bennett",
      position: 6,
    },
    {
      id: "7",
      image: "https://images.moksy.com/templates/default/teams/team-eight.jpg",
      comment:
        "Get rid of the routine feel from your learning process and replace lame methods with fun and engaging ones.",
      name: "Alex Johnson",
      position: 7,
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Handle click to switch active testimonial
  const handleTestimonialClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Reposition testimonials when active index changes
  const repositionTestimonials = useCallback(() => {
    const newPositions = [...testimonials];
    for (let i = 0; i < newPositions.length; i++) {
      // Calculate position relative to active testimonial
      const positionNumber =
        ((i - activeIndex + testimonials.length) % testimonials.length) + 1;
      newPositions[i] = { ...newPositions[i], position: positionNumber };
    }
    setTestimonials(newPositions);
  }, [activeIndex, testimonials]);

  useEffect(() => {
    repositionTestimonials();
  }, [activeIndex, repositionTestimonials]);

  return (
    <section
      id="tikluTestimonial"
      className="tikluTestimonial"
      itemScope
      itemType="http://schema.org/Organization"
      itemProp="text"
    >
      <div id="testimonial-area">
        <div className="container mx-auto px-4">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <div className="section-heading text-center">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Why we are the first choice of students and parents?
                </h2>
              </div>
            </div>
          </div>

          <div className="testi-wrap">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`client-single ${
                  testimonial.position === 1 ? "active" : "inactive"
                } position-${testimonial.position}`}
                data-position={`position-${testimonial.position}`}
                onClick={() =>
                  handleTestimonialClick(
                    testimonials.findIndex((t) => t.id === testimonial.id)
                  )
                }
              >
                <div className="client-img">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={150}
                    height={150}
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="client-comment">
                  <h3>{testimonial.comment}</h3>
                  <span>
                    <i className="fa fa-quote-left"></i>
                  </span>
                </div>
                <div className="client-info">
                  <h3>{testimonial.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}