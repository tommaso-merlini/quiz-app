"use client";

import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function SlideShow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(timer);
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => nextSlide(),
    onSwipedRight: () => prevSlide(),
    trackMouse: true,
  });

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardContent className="p-0">
        <div {...handlers} className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {[...Array(totalSlides)].map((_, index) => (
                <CarouselItem
                  key={index}
                  className={index === currentSlide ? "" : "hidden"}
                >
                  {/*<Image
                    src={`/placeholder.svg?text=Slide ${index + 1}`}
                    alt={`Slide ${index + 1}`}
                    width={800}
                    height={400}
                    className="w-full h-64 object-cover"
                  />*/}
                  <div className="w-[800px] h-[400px] bg-red-400"></div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {[...Array(totalSlides)].map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentSlide ? "bg-white" : "bg-gray-400"
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
