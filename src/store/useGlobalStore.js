import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { styleSlice } from "./slice/styleSlice";

export const useGlobalStore = create(
  persist(
    (set) => ({
      ...styleSlice(set),
    }),
    {
      name: "style-storage", // nome della chiave nello storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
