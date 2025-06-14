"use client";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

import React, { useRef } from "react";
import formula1 from "./formula-1.jpg";
function SkewOnScroll() {
  const ref = useRef(null);
  const { scrollYProgress, scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const speed = useVelocity(scrollY);
  const x = useTransform(scrollYProgress, [0, 1], ["25%", "-100%"]);
  const skew = useTransform(speed, [-1000, 1000], [-15, 15]);

  const springX = useSpring(x, { damping: 20 });
  const springSkey = useSpring(skew, {
    stiffness: 300,
    damping: 20,
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  return (
    <div>
      <section className="bg-red-500 w-full h-screen flex items-center justify-center">
        <h2 className="text-6xl text-white uppercase font-bold">Section 1</h2>
      </section>
      <motion.section className="relative h-[300vh] bg-green-800" ref={ref}>
        <motion.div className="h-screen flex items-center sticky top-0 left-0 overflow-x-hidden">
          <motion.img
            src={formula1.src}
            className="w-full h-full inset-0 absolute object-cover"
            style={{ scale }}
            alt="formula"
          />
          <div className="w-full h-full inset-0 absolute object-cover bg-black/50"></div>
          <motion.h2
            className="text-8xl font-bold text-white text-nowrap uppercase z-50"
            style={{ x: springX, skewX: springSkey }}
          >
            he most dangerous phrase in the language is, Weve always done it
            this way.
          </motion.h2>
        </motion.div>
      </motion.section>
      <section className="bg-orange-500 w-full h-screen flex items-center justify-center">
        <h2 className="text-6xl text-white uppercase font-bold">Section 2</h2>
      </section>
    </div>
  );
}

export default SkewOnScroll;
