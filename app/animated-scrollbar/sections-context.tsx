import { createContext } from "react";

export type SectionsContextType = {
  currentSection: number;
  setCurrentSection: React.Dispatch<React.SetStateAction<number>>;
  sectionProgress: number;
  setSectionProgress: React.Dispatch<React.SetStateAction<number>>;
  bulletsCount: number;
  setBulletsCount: React.Dispatch<React.SetStateAction<number>>;
};

// ⚠️ Dummy default throws if used outside provider
export const SectionsContext = createContext<SectionsContextType>({
  currentSection: 0,
  setCurrentSection: () => {
    throw new Error("setCurrentSection called outside of provider");
  },
  sectionProgress: 0,
  setSectionProgress: () => {
    throw new Error("setSectionProgress called outside of provider");
  },
  bulletsCount: 0,
  setBulletsCount: () => {
    throw new Error("setBulletsCount called outside of provider");
  },
});
