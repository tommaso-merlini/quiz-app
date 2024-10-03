"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

export default function ProductShowcase() {
  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  return (
    <Tabs
      defaultValue="subject"
      className="w-full bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-[0_0_30px_rgba(0,0,0,0.1)]"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="subject">
          Create Subjects and Dump Notes
        </TabsTrigger>
        <TabsTrigger value="test">Generate Tests from Notes</TabsTrigger>
        <TabsTrigger value="grade">Grade Tests</TabsTrigger>
      </TabsList>
      <TabsContent value="subject">
        <video autoPlay muted loop playsInline className="object-cover">
          <source
            src={isMobile ? "/subject-mobile.webm" : "/subject.webm"}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </TabsContent>
      <TabsContent value="test">
        <div className="w-full aspect-video overflow-hidden h-[700px]">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src={isMobile ? "/test-mobile.webm" : "/test.webm"}
              type="video/webm"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </TabsContent>
      <TabsContent value="grade">
        <video autoPlay muted loop playsInline className="object-cover">
          <source
            src={isMobile ? "/grade-mobile.webm" : "/grade.webm"}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </TabsContent>
    </Tabs>
  );
}
