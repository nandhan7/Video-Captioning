"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface Caption {
  text: string;
  startTime: number;
  endTime: number;
}

interface VideoPlayerProps {
  url: string;
  captions: Caption[];
}

export default function VideoPlayer({ url, captions }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [captionFile, setCaptionFile] = useState("");

  // Generate a VTT (WebVTT) file dynamically when captions update
  useEffect(() => {
    if (captions.length === 0) return;

    let vttContent = "WEBVTT\n\n";
    captions.forEach(({ text, startTime, endTime }, index) => {
      if (startTime >= endTime) {
        toast.error(`Caption ${index + 1} has invalid timing!`);
        return;
      }
      vttContent += `${index + 1}\n`;
      vttContent += `${new Date(startTime * 1000).toISOString().substr(11, 12)} --> ${new Date(
        endTime * 1000
      ).toISOString().substr(11, 12)}\n`;
      vttContent += `${text}\n\n`;
    });
   

    try {
      const blob = new Blob([vttContent], { type: "text/vtt" });
      const url = URL.createObjectURL(blob);
      setCaptionFile(url);
      
    } catch (error) {
        console.log(error)
      toast.error("Failed to generate captions.");
    }

    return () => URL.revokeObjectURL(url);
  }, [captions]);

  return (
    <motion.div 
      className="w-full max-w-3xl mx-auto p-4 bg-gradient-to-r from-blue-100 to-white rounded-xl shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      
      <motion.video 
        ref={videoRef} 
        controls 
        className="w-full rounded-lg" 
        whileHover={{ scale: 1.02 }}
      >
        <source src={url} type="video/mp4" />
        {captionFile && <track src={captionFile} kind="subtitles" srcLang="en" label="English" default />}
      </motion.video>
    </motion.div>
  );
}
