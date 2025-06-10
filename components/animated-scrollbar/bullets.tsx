import { sectionsContext } from "@/app/animated-scrollbar/page";
import { motion } from "motion/react";
import React, { useContext } from "react";

type BulletsPropsType = {
  bulletsCount: number;
};

const Bullets: React.FC<BulletsPropsType> = ({ bulletsCount }) => {
  const { currentSection, sectionProgress } = useContext(sectionsContext);
  return (
    <div className="fixed flex flex-col gap-2 top-1/2 -translate-y-1/2 right-6 ">
      {Array.from({ length: bulletsCount }).map((_, index) => {
        return (
          <motion.div
            className="w-[8px] rounded-full bg-gray-700 relative overflow-hidden"
            style={{
              background: index === currentSection ? "#636e72" : "#2d3436",
            }}
            key={`bullet-${index}`}
            animate={{ height: index === currentSection ? 32 : 8 }}
          >
            {index === currentSection && (
              <motion.div
                className="absolute left-0 top-0 bg-amber-300 w-full"
                animate={{ height: `${sectionProgress * 100}%` }}
              ></motion.div>
            )}
          </motion.div>
        );
        return (
          <div
            className="w-3 h-12  rounded-full bg-gray-500 relative overflow-hidden"
            key={`bullet-${index}`}
          ></div>
        );
      })}
    </div>
  );
};

export default Bullets;
