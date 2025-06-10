"use client";
import Bullets from "@/components/animated-scrollbar/bullets";
import Section from "@/components/animated-scrollbar/section";
import React, { createContext, useEffect, useState } from "react";

export const sectionsContext = createContext<{
  currentSection: number;
  setCurrentSection: React.Dispatch<React.SetStateAction<number>>;
  sectionProgress: number;
  setSectionProgress: React.Dispatch<React.SetStateAction<number>>;
  bulletsCount: number;
  setBulletsCount: React.Dispatch<React.SetStateAction<number>>;
}>({
  currentSection: 0,
  setCurrentSection: () => {},
  sectionProgress: 0,
  setSectionProgress: () => {},
  bulletsCount: 0,
  setBulletsCount: () => {},
});

const useSectionsData = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  const [bulletsCount, setBulletsCount] = useState(0);

  return {
    currentSection,
    setCurrentSection,
    sectionProgress,
    setSectionProgress,
    bulletsCount,
    setBulletsCount,
  };
};

function AnimatedScrollBar() {
  const values = useSectionsData();
  const sections = [
    {
      id: 0,
      title: "Section 0",
    },
    {
      id: 1,
      title: "Section 1",
    },
    {
      id: 2,
      title: "Section 2",
    },
    {
      id: 3,
      title: "Section 3",
    },
    {
      id: 4,
      title: "Section 4",
    },
    {
      id: 5,
      title: "Section 5",
    },
  ];

  useEffect(() => {
    values.setBulletsCount(sections.length);
  });
  return (
    <>
      <sectionsContext.Provider value={values}>
        <Bullets bulletsCount={sections.length} />
        {sections.map(({ id, title }) => (
          <Section id={id} title={title} key={`section-${id}`} />
        ))}
      </sectionsContext.Provider>
    </>
  );
}

export default AnimatedScrollBar;
