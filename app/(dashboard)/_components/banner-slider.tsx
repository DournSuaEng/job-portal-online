// app/(dashboard)/_components/banner-slider.tsx
"use client";

import Image from "next/image";
import Box from "@/components/box";
import { useKeenSlider, KeenSliderPlugin, KeenSliderInstance } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

// 👉 Images for the slider
const images = [
  "/img/Image_fx.jpg",
  "/img/Image_fx1.jpg",
  "/img/Image_fx2.jpg",
  "/img/Image_fx3.jpg",
  "/img/Image_fx4.jpg",
];

// 👉 Autoplay plugin for keen-slider
const AutoplayPlugin: KeenSliderPlugin = (slider: KeenSliderInstance) => {
  let timeout: ReturnType<typeof setTimeout>;
  let mouseOver = false;

  function clearNextTimeout() {
    clearTimeout(timeout);
  }

  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, 3000);
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });

  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
};

const BannerSlider = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slides: {
        perView: 1,
        spacing: 0,
      },
      renderMode: "performance",
      defaultAnimation: {
        duration: 2000,
        easing: (t: number) => t * (2 - t), // smooth ease-out
      },
    },
    [AutoplayPlugin]
  );

  return (
    <Box className="relative h-64 md:h-80 lg:h-[400px] mt-12 rounded-2xl overflow-hidden shadow-md">
      <div ref={sliderRef} className="keen-slider h-full w-full">
        {images.map((src, index) => (
          <div key={index} className="keen-slider__slide relative h-full w-full">
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover w-full h-full transition-all duration-1000 ease-in-out rounded-2xl"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </Box>
  );
};

export default BannerSlider;
