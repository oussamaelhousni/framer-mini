"use client";
import React, { useEffect, useState } from "react";
import { motion, useAnimate, useMotionValue } from "framer-motion";
import Image from "next/image";
import useMeasure from "react-use-measure";

// Define the image list
const images = [
  "/image-1.jpg",
  "/image-2.jpg",
  "/image-3.jpg",
  "/image-4.jpg",
  "/image-5.jpg",
  "/image-6.jpg",
  "/image-7.jpg",
  "/image-8.jpg",
];

type CardType = {
  img: string;
};

function Card({ img }: CardType) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="min-h-[200px] min-w-[200px] object-cover relative rounded-lg overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="inset-0 bg-black/50 absolute grid place-items-center z-10">
          <button className="rounded-full px-4 py-1.5 bg-white">
            Discover
          </button>
        </div>
      )}
      <Image src={img} alt={img} fill className="w-full h-full object-cover" />
    </div>
  );
}

const SLOW_DURATION = 20;
const FAST_DURATION = 3;

function InfiniteScrollableImages() {
  const [, animate] = useAnimate();
  const [duration, setDuration] = useState(FAST_DURATION);
  const xTranslation = useMotionValue(0);
  const [ref, { width }] = useMeasure();
  const [mustFinish, setMustFinish] = useState(false);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    let controls;
    const finalPosition = -width / 2 - 8;

    if (mustFinish) {
      controls = animate(xTranslation, [xTranslation.get(), finalPosition], {
        ease: "linear",
        duration: duration * (1 - xTranslation.get() / finalPosition),
        onComplete: () => {
          setMustFinish(false);
          setRerender(!rerender);
        },
      });
    } else {
      controls = animate(xTranslation, [0, finalPosition], {
        ease: "linear",
        duration: duration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
      });
    }

    return controls?.stop;
  }, [rerender, xTranslation, duration, width, mustFinish, animate]);
  return (
    <div className="py-8 overflow-x-hidden w-full">
      <motion.div
        className="flex flex-nowrap gap-4"
        ref={ref}
        style={{ x: xTranslation }}
        onHoverStart={() => {
          setDuration(SLOW_DURATION);
          setMustFinish(true);
        }}
        onHoverEnd={() => {
          setDuration(FAST_DURATION);
          setMustFinish(true);
        }}
      >
        {[...images, ...images].map((img, index) => (
          <Card img={img} key={index} />
        ))}
      </motion.div>
    </div>
  );
}

export default InfiniteScrollableImages;
