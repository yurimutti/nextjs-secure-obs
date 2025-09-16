"use client";

import { useEffect, useRef } from "react";

type AriaLiveType = "polite" | "assertive" | "off";

export function useScreenReaderAnnouncement() {
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!liveRegionRef.current) {
      const politeRegion = document.createElement("div");
      politeRegion.setAttribute("aria-live", "polite");
      politeRegion.setAttribute("aria-atomic", "true");
      politeRegion.className = "sr-only";
      politeRegion.id = "polite-announcements";
      document.body.appendChild(politeRegion);

      const assertiveRegion = document.createElement("div");
      assertiveRegion.setAttribute("aria-live", "assertive");
      assertiveRegion.setAttribute("aria-atomic", "true");
      assertiveRegion.className = "sr-only";
      assertiveRegion.id = "assertive-announcements";
      document.body.appendChild(assertiveRegion);

      liveRegionRef.current = politeRegion;
    }

    return () => {
      const politeRegion = document.getElementById("polite-announcements");
      const assertiveRegion = document.getElementById(
        "assertive-announcements"
      );

      if (politeRegion) {
        document.body.removeChild(politeRegion);
      }
      if (assertiveRegion) {
        document.body.removeChild(assertiveRegion);
      }
    };
  }, []);

  const announce = (message: string, priority: AriaLiveType = "polite") => {
    if (priority === "off") return;

    const regionId =
      priority === "assertive"
        ? "assertive-announcements"
        : "polite-announcements";
    const region = document.getElementById(regionId);

    if (region) {
      region.textContent = "";

      setTimeout(() => {
        region.textContent = message;
      }, 100);

      setTimeout(() => {
        region.textContent = "";
      }, 3000);
    }
  };

  return { announce };
}
