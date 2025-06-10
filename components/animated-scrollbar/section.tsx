import { SectionsContext } from "@/app/animated-scrollbar/sections-context";
import { useMotionValueEvent, useScroll } from "motion/react";
import React, { useContext, useRef } from "react";

type SectionPropsType = {
  id: number;
  title: string;
};

const colors = ["#6c5ce7", "#00cec9", "#636e72", "#d63031", "#00b894"];

const Section: React.FC<SectionPropsType> = ({ id, title }) => {
  const { setCurrentSection, setSectionProgress, bulletsCount } =
    useContext(SectionsContext);
  const ref = useRef<HTMLDivElement>(null);

  const isFirst = id === 0;
  const isLast = id === bulletsCount - 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: isFirst
      ? ["start start", "end center"]
      : isLast
      ? ["start center", "end end"]
      : ["start center", "end center"],
  });

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (current > 0 && current < 1) {
      setCurrentSection(id);
      setSectionProgress(current);
    }
  });
  return (
    <div
      ref={ref}
      className="flex items-center justify-center w-full h-screen text-6xl font-medium text-white"
      style={{ background: colors[id] }}
    >
      {title}
    </div>
  );
};

export default Section;
